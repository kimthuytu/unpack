"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET = exports.TABLE_NAME = exports.s3Client = exports.dynamoDocClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_s3_1 = require("@aws-sdk/client-s3");
const region = process.env.AWS_REGION || 'us-east-1';
// DynamoDB client
const dynamoClient = new client_dynamodb_1.DynamoDBClient({ region });
exports.dynamoDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
// S3 client
exports.s3Client = new client_s3_1.S3Client({ region });
// Table and bucket names
exports.TABLE_NAME = process.env.DYNAMODB_TABLE || 'unpack-backend-dev';
exports.S3_BUCKET = process.env.S3_BUCKET || 'unpack-backend-dev';
//# sourceMappingURL=aws.config.js.map