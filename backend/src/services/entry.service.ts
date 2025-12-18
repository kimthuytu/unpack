import { PutCommand, GetCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, TABLE_NAME } from '../config/aws.config';
import { Entry } from '../models/entry.model';
import { v4 as uuidv4 } from 'uuid';

export class EntryService {
  async createEntry(userId: string, images: string[]): Promise<Entry> {
    const entry: Entry = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      images,
    };

    await dynamoDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: entry,
      })
    );

    return entry;
  }

  async getEntry(id: string): Promise<Entry | null> {
    const result = await dynamoDocClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    return (result.Item as Entry) || null;
  }

  async updateEntry(entry: Entry): Promise<Entry> {
    await dynamoDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: entry,
      })
    );

    return entry;
  }

  async listEntries(userId: string, limit: number = 50): Promise<Entry[]> {
    const result = await dynamoDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'userId-createdAt-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ScanIndexForward: false, // Most recent first
        Limit: limit,
      })
    );

    return (result.Items as Entry[]) || [];
  }

  async deleteEntry(id: string): Promise<void> {
    await dynamoDocClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );
  }
}


