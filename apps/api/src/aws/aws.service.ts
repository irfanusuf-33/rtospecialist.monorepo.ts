import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'ap-southeast-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY')!,
      },
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    const fileKey = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return fileKey;
    } catch (error: any) {
      throw new InternalServerErrorException(`AWS S3 Upload Failure: ${error.message}`);
    }
  }

  async getPresignedUrl(fileKey: string, expiresInSeconds = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    } catch (error: any) {
      throw new InternalServerErrorException(`AWS S3 Link Generation Failure: ${error.message}`);
    }
  }

  async downloadStream(fileKey: string, customBucket?: string): Promise<Readable> {
    const bucket = customBucket || this.configService.get<string>('AWS_BUCKET_NAME');
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );
    return response.Body as Readable;
  }
}