"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntry = exports.listEntries = exports.createEntry = void 0;
const auth_1 = require("../utils/auth");
const entry_service_1 = require("../services/entry.service");
const storage_service_1 = require("../services/storage.service");
const entryService = new entry_service_1.EntryService();
const storageService = new storage_service_1.StorageService();
const createEntry = async (event) => {
    try {
        const userId = (0, auth_1.getUserIdFromEvent)(event);
        const body = JSON.parse(event.body || '{}');
        if (!body.images || body.images.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'At least one image is required' }),
            };
        }
        // Generate signed URLs for images (assuming images are already uploaded)
        // In a real implementation, you'd handle multipart file uploads here
        const imageUrls = await Promise.all(body.images.map(async (imageKey) => {
            return await storageService.getPublicUrl(imageKey);
        }));
        const entry = await entryService.createEntry(userId, imageUrls);
        return {
            statusCode: 201,
            body: JSON.stringify(entry),
        };
    }
    catch (error) {
        console.error('Create entry error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' }),
        };
    }
};
exports.createEntry = createEntry;
const listEntries = async (event) => {
    try {
        const userId = (0, auth_1.getUserIdFromEvent)(event);
        const entries = await entryService.listEntries(userId);
        return {
            statusCode: 200,
            body: JSON.stringify({ entries }),
        };
    }
    catch (error) {
        console.error('List entries error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' }),
        };
    }
};
exports.listEntries = listEntries;
const getEntry = async (event) => {
    try {
        const userId = (0, auth_1.getUserIdFromEvent)(event);
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
    }
    catch (error) {
        console.error('Get entry error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' }),
        };
    }
};
exports.getEntry = getEntry;
//# sourceMappingURL=entries.js.map