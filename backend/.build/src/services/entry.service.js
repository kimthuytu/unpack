"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryService = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const aws_config_1 = require("../config/aws.config");
const uuid_1 = require("uuid");
class EntryService {
    async createEntry(userId, images) {
        const entry = {
            id: (0, uuid_1.v4)(),
            userId,
            createdAt: new Date().toISOString(),
            images,
        };
        await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.PutCommand({
            TableName: aws_config_1.TABLE_NAME,
            Item: entry,
        }));
        return entry;
    }
    async getEntry(id) {
        const result = await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.GetCommand({
            TableName: aws_config_1.TABLE_NAME,
            Key: { id },
        }));
        return result.Item || null;
    }
    async updateEntry(entry) {
        await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.PutCommand({
            TableName: aws_config_1.TABLE_NAME,
            Item: entry,
        }));
        return entry;
    }
    async listEntries(userId, limit = 50) {
        const result = await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.QueryCommand({
            TableName: aws_config_1.TABLE_NAME,
            IndexName: 'userId-createdAt-index',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            ScanIndexForward: false, // Most recent first
            Limit: limit,
        }));
        return result.Items || [];
    }
    async deleteEntry(id) {
        await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.DeleteCommand({
            TableName: aws_config_1.TABLE_NAME,
            Key: { id },
        }));
    }
}
exports.EntryService = EntryService;
//# sourceMappingURL=entry.service.js.map