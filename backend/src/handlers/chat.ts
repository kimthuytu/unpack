import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserIdFromEvent } from '../utils/auth';
import { EntryService } from '../services/entry.service';
import { ChatService } from '../services/chat.service';
import { AIService } from '../services/ai.service';
import { SendChatMessageRequest } from '../models/chat.model';

const entryService = new EntryService();
const chatService = new ChatService();
const aiService = new AIService();

export const sendChatMessage = async (
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

    const body = JSON.parse(event.body || '{}') as SendChatMessageRequest;

    if (!body.message || body.message.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Get entry
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

    // Get chat history
    const chatHistory = await chatService.getChatHistory(entryId, userId);
    
    // Create user message
    const userMessage = await chatService.createUserMessage(
      entryId,
      userId,
      body.message
    );

    // Format chat history for AI
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await aiService.generateChatResponse(
      entry,
      formattedHistory,
      body.message
    );

    // Create assistant message
    const assistantMessage = await chatService.createAssistantMessage(
      entryId,
      userId,
      aiResponse
    );

    return {
      statusCode: 200,
      body: JSON.stringify(assistantMessage),
    };
  } catch (error: any) {
    console.error('Send chat message error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export const getChatHistory = async (
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

    // Verify entry ownership
    const entry = await entryService.getEntry(entryId);
    if (!entry) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Entry not found' }),
      };
    }

    if (entry.userId !== userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    // Get chat history
    const messages = await chatService.getChatHistory(entryId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ messages }),
    };
  } catch (error: any) {
    console.error('Get chat history error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};


