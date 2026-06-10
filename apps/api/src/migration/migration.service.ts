import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MongoClient, ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { GroupType, VersionStatus } from '@prisma/client';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('🔄 Checking migration initialization flags...');
    // Optional: Trigger your complete pipeline on startup if desired
    // await this.runCompleteMigrationPipeline();
  }

  /**
   * CORE MASTER PIPELINE
   * Orchestrates the precise sequential execution required for safe data hydration.
   * Runs Categories and Subcategories first, followed by the Product catalogs.
   */
  async runCompleteMigrationPipeline(): Promise<{ success: boolean; categories: any; products: any }> {
    this.logger.log('🔥 Initializing Global Relational Migration Pipeline Process...');
    
    // Step 1: Extract, translate, and populate Category & Subcategory Master configurations
    const categoriesResult = await this.migrateCategoriesAndSubcategories();
    
    // Step 2: Migrate core products now that foreign keys are safely in place inside Postgres
    const productsResult = await this.runMongoToPostgresMigration();

    return {
      success: true,
      categories: categoriesResult,
      products: productsResult,
    };
  }

  /**
   * PHASE 1: CATEGORIES & SUBCATEGORIES ETL PIPELINE
   * Hydrates taxonomy and injects tracking mongoId handles for relational mapping
   */
  async migrateCategoriesAndSubcategories(): Promise<{ success: boolean; categoriesProcessed: number; subcategoriesProcessed: number }> {
    this.logger.log('🚀 [PHASE 1] Initializing Category and Subcategory ETL pipeline...');

    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) throw new Error('Missing MONGO_URI in environment configuration');

    const mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();

    let categoriesProcessed = 0;
    let subcategoriesProcessed = 0;

    try {
      const mongoCategories = await db.collection('categories').find({}).toArray();
      this.logger.log(`📥 Extracted ${mongoCategories.length} master categories from MongoDB.`);

      for (const mCat of mongoCategories) {
        const cleanCatName = mCat.name?.trim();
        const cleanAbbreviation = mCat.abbreviation?.trim();
        
        // MongoDB Driver deserializes BSON natively, so _id is a native ObjectId instance
        const originalCatMongoId = mCat._id.toString();

        if (!cleanCatName || !cleanAbbreviation) {
          this.logger.warn(`⚠️ Skipping malformed MongoDB Category with ID: ${originalCatMongoId}`);
          continue;
        }

        // Upsert Category matching by unique name, saving original _id into mongoId
        const postgresCategory = await this.prisma.category.upsert({
          where: { name: cleanCatName },
          update: {
            mongoId: originalCatMongoId, // Permanent lookup translation anchor
            abbreviation: cleanAbbreviation,
            headline: mCat.headline || null,
            subHeadline: mCat.subHeadline || null,
            url: mCat.url || null,
            disable: typeof mCat.disable === 'boolean' ? mCat.disable : true,
            iconUrl: mCat.iconUrl || '',
            isNewlyUpdated: !!mCat.isNewlyUpdated,
            newProductFlagExpiry: mCat.newProductFlagExpiry ? new Date(mCat.newProductFlagExpiry) : null,
            updatedAt: mCat.updatedAt ? new Date(mCat.updatedAt) : new Date(),
          },
          create: {
            name: cleanCatName,
            mongoId: originalCatMongoId, // Permanent lookup translation anchor
            abbreviation: cleanAbbreviation,
            headline: mCat.headline || null,
            subHeadline: mCat.subHeadline || null,
            url: mCat.url || null,
            disable: typeof mCat.disable === 'boolean' ? mCat.disable : true,
            iconUrl: mCat.iconUrl || '',
            isNewlyUpdated: !!mCat.isNewlyUpdated,
            newProductFlagExpiry: mCat.newProductFlagExpiry ? new Date(mCat.newProductFlagExpiry) : null,
            createdAt: mCat.createdAt ? new Date(mCat.createdAt) : new Date(),
            updatedAt: mCat.updatedAt ? new Date(mCat.updatedAt) : new Date(),
          },
        });

        categoriesProcessed++;

        // Process Child Subcategories safely unpacking subLinks wrapper shapes
        if (Array.isArray(mCat.subLinks) && mCat.subLinks.length > 0) {
          
          const subCategoryIds = mCat.subLinks
            .map((link: any) => {
              if (!link) return null;
              if (typeof link === 'string') return new ObjectId(link);
              if (link.$oid) return new ObjectId(link.$oid); // Unwraps the nested object {"$oid": "..."}
              if (link instanceof ObjectId) return link;
              return null;
            })
            .filter((id): id is ObjectId => id !== null);

          if (subCategoryIds.length > 0) {
            const mongoSubCategories = await db
              .collection('subcategories')
              .find({ _id: { $in: subCategoryIds } })
              .toArray();

            for (const mSubCat of mongoSubCategories) {
              const cleanSubName = mSubCat.name?.trim();
              const originalSubCatMongoId = mSubCat._id.toString();
              if (!cleanSubName) continue;

              await this.prisma.subcategory.upsert({
                where: { name: cleanSubName },
                update: {
                  mongoId: originalSubCatMongoId, 
                  url: mSubCat.url || null,
                  disable: typeof mSubCat.disable === 'boolean' ? mSubCat.disable : false,
                  categoryId: postgresCategory.id, // Balanced relational key link
                  updatedAt: mSubCat.updatedAt ? new Date(mSubCat.updatedAt) : new Date(),
                },
                create: {
                  name: cleanSubName,
                  mongoId: originalSubCatMongoId, 
                  url: mSubCat.url || null,
                  disable: typeof mSubCat.disable === 'boolean' ? mSubCat.disable : false,
                  categoryId: postgresCategory.id, // Balanced relational key link
                  createdAt: mSubCat.createdAt ? new Date(mSubCat.createdAt) : new Date(),
                  updatedAt: mSubCat.updatedAt ? new Date(mSubCat.updatedAt) : new Date(),
                },
              });

              subcategoriesProcessed++;
            }
          }
        }
      }

      this.logger.log('✅ [PHASE 1] Taxonomy structures successfully written to Postgres disk.');
      return { success: true, categoriesProcessed, subcategoriesProcessed };
    } catch (error: any) {
      this.logger.error(`❌ [PHASE 1] Pipeline crashed: ${error.message}`);
      throw error;
    } finally {
      await mongoClient.close();
    }
  }

  /**
   * PHASE 2: PRODUCTS ENTITY DATA RECONCILIATION
   * Maps incoming documents to categories and subcategories using the original Mongo IDs
   */
  async runMongoToPostgresMigration(): Promise<{ success: boolean; processed: number }> {
    this.logger.log('🚀 [PHASE 2] Initializing Core Products Data Migration Loop (Optimized)...');
    
    const mongoUri = this.configService.get<string>('MONGO_URI');
    if (!mongoUri) throw new Error('Missing MONGO_URI in environment configuration');

    const mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();
    let successCount = 0;

    try {
      const legacyProducts = await db.collection('products').find({}).toArray();
      this.logger.log(`📥 Extracted ${legacyProducts.length} items from legacy products collection.`);

      // ⚡ STEP 1: Bulk fetch all taxonomies into memory BEFORE entering the loop
      this.logger.log('⚡ Indexing Categories and Subcategories from Postgres for lightning lookup...');
      
      const allPostgresCategories = await this.prisma.category.findMany({
        where: { mongoId: { not: null } },
        select: { mongoId: true }
      });
      const allPostgresSubcategories = await this.prisma.subcategory.findMany({
        where: { mongoId: { not: null } },
        select: { mongoId: true }
      });

      // Convert arrays into fast-lookup hash Sets
      const categoryMap = new Set(allPostgresCategories.map(c => c.mongoId));
      const subcategoryMap = new Set(allPostgresSubcategories.map(s => s.mongoId));

      this.logger.log(`🎯 Cached ${categoryMap.size} Categories and ${subcategoryMap.size} Subcategories in memory.`);

      // ⚡ STEP 2: Start processing the products loop using the fast in-memory cache
      for (const mp of legacyProducts) {
        const cleanProductId = mp.productId ? mp.productId.trim().toUpperCase() : `MIGRATE-${new ObjectId().toString()}`;
        
        // Log progress occasionally so you know it's moving
        if (successCount % 50 === 0 && successCount > 0) {
          this.logger.log(`⏳ Progress: Processed ${successCount}/${legacyProducts.length} products...`);
        }

        const versionNumber = mp.version?.number ?? 1;
        const versionStatus = (mp.version?.status ?? 'available') as VersionStatus;

        const formattedSections = Array.isArray(mp.productDetailsSections)
          ? mp.productDetailsSections.map((section: any) => ({
              title: section.title || '',
              description: section.description || '',
              bullets: Array.isArray(section.bullets) ? section.bullets : [],
            }))
          : [];

        // Isolate incoming Mongo structural references
        const incomingCategoryIds: string[] = Array.isArray(mp.category) 
          ? mp.category.map(id => id.toString()).filter(Boolean) 
          : [];
        const incomingSubcategoryIds: string[] = Array.isArray(mp.subcategory) 
          ? mp.subcategory.map(id => id.toString()).filter(Boolean) 
          : [];

        // ⚡ STEP 3: Filter keys instantly using memory maps (No database network calls here!)
        const finalCategoryConnectors = incomingCategoryIds
          .filter(id => categoryMap.has(id))
          .map(id => ({ mongoId: id }));

        const finalSubcategoryConnectors = incomingSubcategoryIds
          .filter(id => subcategoryMap.has(id))
          .map(id => ({ mongoId: id }));

        // Upsert Product record atomically
        await this.prisma.product.upsert({
          where: { productId: cleanProductId },
          update: {
            name: mp.name || '',
            description: mp.description || '',
            aboutUnit: mp.aboutUnit || [],
            price: mp.price || 0.0,
            salePrice: mp.salePrice || 0.0,
            group: mp.group === 'Elective Units' ? GroupType.Elective_Units : GroupType.Core_Units,
            productDetailsSections: formattedSections as any,
            versionNumber,
            versionStatus,
            categories: {
              set: finalCategoryConnectors as any,
            },
            subcategories: {
              set: finalSubcategoryConnectors as any,
            },
          },
          create: {
            productId: cleanProductId,
            name: mp.name || '',
            description: mp.description || '',
            aboutUnit: mp.aboutUnit || [],
            price: mp.price || 0.0,
            salePrice: mp.salePrice || 0.0,
            group: mp.group === 'Elective Units' ? GroupType.Elective_Units : GroupType.Core_Units,
            productDetailsSections: formattedSections as any,
            versionNumber,
            versionStatus,
            categories: {
              connect: finalCategoryConnectors as any,
            },
            subcategories: {
              connect: finalSubcategoryConnectors as any,
            },
          },
        });
        
        successCount++;
      }

      this.logger.log(`✅ [PHASE 2] Core product entities written smoothly. Migrated: ${successCount} entries.`);
      return { success: true, processed: successCount };

    } catch (error: any) {
      this.logger.error(`❌ [PHASE 2] Execution halted unexpectedly: ${error.message}`);
      throw error;
    } finally {
      await mongoClient.close();
    }
  }
}