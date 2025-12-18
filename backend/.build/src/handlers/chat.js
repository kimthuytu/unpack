"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.sendChatMessage = void 0;
const auth_1 = require("../utils/auth");
const entry_service_1 = require("../services/entry.service");
const chat_service_1 = require("../services/chat.service");
const ai_service_1 = require("../services/ai.service");
const entryService = new entry_service_1.EntryService();
const chatService = new chat_service_1.ChatService();
const aiService = new ai_service_1.AIService();
const sendChatMessage = async (event) => {
    try {
        const userId = (0, auth_1.getUserIdFromEvent)(event);
        const entryId = event.pathParameters?.id;
        if (!entryId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Entry ID is required' }),
            };
        }
        const body = JSON.parse(event.body || '{}');
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
        const userMessage = await chatService.createUserMessage(entryId, userId, body.message);
        // Format chat history for AI
        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
        // Generate AI response
        const aiResponse = await aiService.generateChatResponse(entry, formattedHistory, body.message);
        // Create assistant message
        const assistantMessage = await chatService.createAssistantMessage(entryId, userId, aiResponse);
        return {
            statusCode: 200,
            body: JSON.stringify(assistantMessage),
        };
    }
    catch (error) {
        console.error('Send chat message error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' }),
        };
    }
};
exports.sendChatMessage = sendChatMessage;
const getChatHistory = async (event) => {
    try {
        const userId = (0, auth_1.getUserIdFromEvent)(event);
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
    }
    catch (error) {
        console.error('Get chat history error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' }),
        };
    }
};
exports.getChatHistory = getChatHistory;
//# sourceMappingURL=chat.js.map