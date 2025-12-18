"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const aws_config_1 = require("../config/aws.config");
const uuid_1 = require("uuid");
class StorageService {
    async uploadImage(imageBuffer, contentType) {
        const key = `images/${(0, uuid_1.v4)()}.jpg`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: aws_config_1.S3_BUCKET,
            Key: key,
            Body: imageBuffer,
            ContentType: contentType,
        });
        await aws_config_1.s3Client.send(command);
        return key;
    }
    async getSignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: aws_config_1.S3_BUCKET,
            Key: key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(aws_config_1.s3Client, command, { expiresIn });
    }
    async getPublicUrl(key) {
        // Generate signed URL that expires in 1 year for entries
        return await this.getSignedUrl(key, 31536000);
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map