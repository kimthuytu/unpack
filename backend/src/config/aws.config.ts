import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';

// DynamoDB client
const dynamoClient = new DynamoDBClient({ region });
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 client
export const s3Client = new S3Client({ region });

// Table and bucket names
export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'unpack-backend-dev';
export const S3_BUCKET = process.env.S3_BUCKET || 'unpack-backend-dev';



