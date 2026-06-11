import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MongoClient, ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdevMigrationService implements OnModuleInit {
  private readonly logger = new Logger(PdevMigrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('🔄 Professional Development Migration script initialized.');
  }

  /**
   * CORE MASTER PIPELINE FOR PDEV ENTITIES
   */
  async runPdevMigrationPipeline(): Promise<{ success: boolean; categories: any; products: any }> {
    this.logger.log('🔥 Initializing Pdev Relational Migration Pipeline Process...');

    // Step 1: Ensure we have an Admin user to assign mandatory createdById fields to
    const defaultAdminId = await this.ensureFallbackAdmin();

    // Step 2: Extract, translate, and populate PdevProductCategory configurations
    const categoriesResult = await this.migratePdevCategories(defaultAdminId);

    // Step 3: Migrate coursetrainings into PdevProduct & PdevFileData
    const productsResult = await this.migratePdevProducts(defaultAdminId);

    return {
      success: true,
      categories: categoriesResult,
      products: productsResult,
    };
  }

  /**
   * Helper to fetch a valid Admin ID since createdById is a required foreign key
   */
  private async ensureFallbackAdmin(): Promise<string> {
    const admin = await this.prisma.admin.findFirst({ select: { id: true } });
    if (!admin) {
      // Create a system migration admin if none exists
      const fallbackAdmin = await this.prisma.admin.create({
        data: {
          id: 'migration-system-admin',
          // Add other mandatory fields required by your Admin schema here
        } as any,
      });
      return fallbackAdmin.id;
    }
    return admin.id;
  }

  /**
   * PHASE 1: CATEGORIES ETL PIPELINE
   * Source: quizcategories collection -> Target: PdevProductCategory table
   */
  async migratePdevCategories(defaultAdminId: string): Promise<{ success: boolean; processed: number }> {
    this.logger.log('🚀 [PDEV PHASE 1] Starting Pdev Category ETL pipeline...');

    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) throw new Error('Missing MONGO_URI in environment configuration');

    const mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();
    let processed = 0;

    try {
      // Querying the collection designated by your Mongoose ref: "quizcategories"
      const mongoCategories = await db.collection('quizcategories').find({}).toArray();
      this.logger.log(`📥 Extracted ${mongoCategories.length} categories from MongoDB.`);

      for (const mCat of mongoCategories) {
        const cleanName = mCat.name?.trim();
        const originalMongoId = mCat._id.toString();

        if (!cleanName) {
          this.logger.warn(`⚠️ Skipping malformed Category with ID: ${originalMongoId}`);
          continue;
        }

        // Target Upsert (Assumes mongoId column exists temporarily for migration purposes)
        await this.prisma.pdevProductCategory.upsert({
          where: { id: originalMongoId }, // Or map via an explicit @unique mongoId string if using UUIDs
          update: {
            name: cleanName,
            isDisabled: typeof mCat.isDisabled === 'boolean' ? mCat.isDisabled : false,
            createdById: defaultAdminId,
            updatedAt: mCat.updatedAt ? new Date(mCat.updatedAt) : new Date(),
          },
          create: {
            id: originalMongoId, // Seeding the MongoDB ID directly guarantees flawless phase 2 pairing
            name: cleanName,
            isDisabled: typeof mCat.isDisabled === 'boolean' ? mCat.isDisabled : false,
            createdById: defaultAdminId,
            createdAt: mCat.createdAt ? new Date(mCat.createdAt) : new Date(),
            updatedAt: mCat.updatedAt ? new Date(mCat.updatedAt) : new Date(),
          },
        });

        processed++;
      }

      this.logger.log(`✅ [PDEV PHASE 1] Categories successfully written to Postgres. Count: ${processed}`);
      return { success: true, processed };
    } catch (error: any) {
      this.logger.error(`❌ [PDEV PHASE 1] Pipeline crashed: ${error.message}`);
      throw error;
    } finally {
      await mongoClient.close();
    }
  }

  /**
   * PHASE 2: PRODUCTS & FILE DATA RELATION RECONCILIATION
   * Source: coursetrainings collection -> Target: PdevProduct & PdevFileData tables
   */
  async migratePdevProducts(defaultAdminId: string): Promise<{ success: boolean; processed: number }> {
    this.logger.log('🚀 [PDEV PHASE 2] Starting Pdev Product & FileData Migration Loop...');

    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) throw new Error('Missing MONGO_URI in environment configuration');

    const mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();
    let processed = 0;

    try {
      const legacyCourses = await db.collection('coursetrainings').find({}).toArray();
      this.logger.log(`📥 Extracted ${legacyCourses.length} items from coursetrainings collection.`);

      // ⚡ Memory Cache Layer: Indexing existing Pdev Categories for O(1) performance lookup 
      const existingCategories = await this.prisma.pdevProductCategory.findMany({ select: { id: true } });
      const validCategoryIds = new Set(existingCategories.map((c) => c.id));

      for (const mc of legacyCourses) {
        const fileId = mc.fileId?.trim();
        const parentMongoId = mc.parent?.toString();

        if (!fileId || !parentMongoId) {
          this.logger.warn(`⚠️ Skipping Course without fileId or Parent reference. ID: ${mc._id}`);
          continue;
        }

        // Verify if category structural link exists on Postgres side
        if (!validCategoryIds.has(parentMongoId)) {
          this.logger.warn(`❌ Skipping Course because Parent Category (${parentMongoId}) wasn't found in Postgres.`);
          continue;
        }

        const resolvedAdminId = mc.createdBy && mc.createdBy.length === 36 ? mc.createdBy : defaultAdminId;

        // Atomic transaction guarantees that products aren't decoupled from nested fileData entries
        await this.prisma.$transaction(async (tx) => {
          
          // 1. Clean upsert the PdevProduct base entry
          const product = await tx.pdevProduct.upsert({
            where: { id: mc._id.toString() }, // Injecting Mongo ID straight into Postgres Primary Key slot
            update: {
              fileId,
              name: mc.name || 'Untitled Course',
              description: mc.description || null,
              fileUploaded: typeof mc.fileUploaded === 'boolean' ? mc.fileUploaded : false,
              iconUrl: mc.iconUrl || '',
              features: Array.isArray(mc.features) ? mc.features : [],
              courseFor: Array.isArray(mc.courseFor) ? mc.courseFor : [],
              objectives: Array.isArray(mc.objectives) ? mc.objectives : [],
              includes: Array.isArray(mc.includes) ? mc.includes : [],
              parentId: parentMongoId,
              createdById: resolvedAdminId,
              createdAt: mc.createdAt ? new Date(mc.createdAt) : new Date(),
              updatedAt: mc.updatedAt ? new Date(mc.updatedAt) : new Date(),
            },
            create: {
              id: mc._id.toString(),
              fileId,
              name: mc.name || 'Untitled Course',
              description: mc.description || null,
              fileUploaded: typeof mc.fileUploaded === 'boolean' ? mc.fileUploaded : false,
              iconUrl: mc.iconUrl || '',
              features: Array.isArray(mc.features) ? mc.features : [],
              courseFor: Array.isArray(mc.courseFor) ? mc.courseFor : [],
              objectives: Array.isArray(mc.objectives) ? mc.objectives : [],
              includes: Array.isArray(mc.includes) ? mc.includes : [],
              parentId: parentMongoId,
              createdById: resolvedAdminId,
              createdAt: mc.createdAt ? new Date(mc.createdAt) : new Date(),
              updatedAt: mc.updatedAt ? new Date(mc.updatedAt) : new Date(),
            },
          });

          // 2. Clear out pre-existing fileData rows to prevent duplicate constraints on repeat execution
          await tx.pdevFileData.deleteMany({ where: { productId: product.id } });

          // 3. Hydrate Normalized One-to-Many nested Subdocuments
          if (Array.isArray(mc.fileData) && mc.fileData.length > 0) {
            const fileDataPayload = mc.fileData.map((fd: any) => ({
              id: fd._id ? fd._id.toString() : undefined, // Preserve original embedded ID if present
              productId: product.id,
              question: fd.question || '',
              questionData: Array.isArray(fd.questionData) ? fd.questionData : [],
              options: Array.isArray(fd.options) ? fd.options : [],
              answer: Array.isArray(fd.answer) ? fd.answer : [],
            }));

            await tx.pdevFileData.createMany({
              data: fileDataPayload,
            });
          }
        });

        processed++;

        if (processed % 20 === 0) {
          this.logger.log(`⏳ Progress: Migrated ${processed}/${legacyCourses.length} Pdev Products...`);
        }
      }

      this.logger.log(`✅ [PDEV PHASE 2] All items converted successfully. Total: ${processed}`);
      return { success: true, processed };
    } catch (error: any) {
      this.logger.error(`❌ [PDEV PHASE 2] Execution stopped: ${error.message}`);
      throw error;
    } finally {
      await mongoClient.close();
    }
  }
}