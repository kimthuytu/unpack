import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserIdFromEvent } from '../utils/auth';
import { EntryService } from '../services/entry.service';
import { StorageService } from '../services/storage.service';
import { CreateEntryRequest } from '../models/entry.model';

const entryService = new EntryService();
const storageService = new StorageService();

export const createEntry = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromEvent(event);
    const body = JSON.parse(event.body || '{}') as CreateEntryRequest;

    if (!body.images || body.images.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'At least one image is required' }),
      };
    }

    // Generate signed URLs for images (assuming images are already uploaded)
    // In a real implementation, you'd handle multipart file uploads here
    const imageUrls = await Promise.all(
      body.images.map(async (imageKey) => {
        return await storageService.getPublicUrl(imageKey);
      })
    );

    const entry = await entryService.createEntry(userId, imageUrls);

    return {
      statusCode: 201,
      body: JSON.stringify(entry),
    };
  } catch (error: any) {
    console.error('Create entry error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export const listEntries = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromEvent(event);
    const entries = await entryService.listEntries(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ entries }),
    };
  } catch (error: any) {
    console.error('List entries error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export const getEntry = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromEvent(event);
    const entryId = event.pathParameters?.id;

    if (!entryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Entry ID is required' }),
      };
    }

    const entry = await entryService.getEntry(entryId);

    if (!entry) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Entry not found' }),
      };
    }

    // Verify ownership
    if (entry.userId !== userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(entry),
    };
  } catch (error: any) {
    console.error('Get entry error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};



