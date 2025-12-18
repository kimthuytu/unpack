import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAME } from '../config/aws.config';
import { ChatMessage } from '../models/chat.model';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
  async createMessage(message: ChatMessage): Promise<ChatMessage> {
    await dynamoDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...message,
          pk: `CHAT#${message.entryId}`,
          sk: `MSG#${message.id}`,
        },
      })
    );

    return message;
  }

  async getChatHistory(entryId: string, userId: string): Promise<ChatMessage[]> {
    const result = await dynamoDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `CHAT#${entryId}`,
          ':userId': userId,
        },
        FilterExpression: 'userId = :userId',
        ScanIndexForward: true, // Oldest first
      })
    );

    const items = (result.Items || []) as ChatMessage[];
    return items.filter(item => item.entryId === entryId && item.userId === userId);
  }

  async createUserMessage(
    entryId: string,
    userId: string,
    content: string
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuidv4(),
      entryId,
      userId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    return await this.createMessage(message);
  }

  async createAssistantMessage(
    entryId: string,
    userId: string,
    content: string,
    context?: ChatMessage['context']
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuidv4(),
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

