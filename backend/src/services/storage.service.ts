import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from '../config/aws.config';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  async uploadImage(imageBuffer: Buffer, contentType: string): Promise<string> {
    const key = `images/${uuidv4()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return key;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  async getPublicUrl(key: string): Promise<string> {
    // Generate signed URL that expires in 1 year for entries
    return await this.getSignedUrl(key, 31536000);
  }
}



