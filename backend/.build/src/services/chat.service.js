"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const aws_config_1 = require("../config/aws.config");
const uuid_1 = require("uuid");
class ChatService {
    async createMessage(message) {
        await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.PutCommand({
            TableName: aws_config_1.TABLE_NAME,
            Item: {
                ...message,
                pk: `CHAT#${message.entryId}`,
                sk: `MSG#${message.id}`,
            },
        }));
        return message;
    }
    async getChatHistory(entryId, userId) {
        const result = await aws_config_1.dynamoDocClient.send(new lib_dynamodb_1.QueryCommand({
            TableName: aws_config_1.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: {
                ':pk': `CHAT#${entryId}`,
                ':userId': userId,
            },
            FilterExpression: 'userId = :userId',
            ScanIndexForward: true, // Oldest first
        }));
        const items = (result.Items || []);
        return items.filter(item => item.entryId === entryId && item.userId === userId);
    }
    async createUserMessage(entryId, userId, content) {
        const message = {
            id: (0, uuid_1.v4)(),
            entryId,
            userId,
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };
        return await this.createMessage(message);
    }
    async createAssistantMessage(entryId, userId, content, context) {
        const message = {
            id: (0, uuid_1.v4)(),
            entryId,
            userId,
            role: 'assistant',
            content,
            timestamp: new Date().toISOString(),
            context,
        };
        return await this.createMessage(message);
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map