import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserIdFromEvent } from '../utils/auth';
import { EntryService } from '../services/entry.service';
import { OCRService } from '../services/ocr.service';
import { AIService } from '../services/ai.service';

const entryService = new EntryService();
const ocrService = new OCRService();
const aiService = new AIService();

export const processOcr = async (
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

    // Process OCR
    const ocrResult = await ocrService.processImages(entry.images);

    // Update entry with OCR results
    entry.ocrText = ocrResult.text;
    entry.ocrConfidence = ocrResult.confidence;

    // If confidence is above threshold, run AI analysis
    if (ocrResult.confidence >= 0.7 && ocrResult.text.length > 0) {
      try {
        const aiAnalysis = await aiService.analyzeEntry(entry);
        
        entry.summary = aiAnalysis.summary;
        entry.sentiment = aiAnalysis.sentiment;
        entry.emotions = aiAnalysis.emotions;
        entry.keySentences = aiAnalysis.keySentences;
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        // Continue even if AI analysis fails
      }
    }

    // Save updated entry
    await entryService.updateEntry(entry);

    return {
      statusCode: 200,
      body: JSON.stringify(entry),
    };
  } catch (error: any) {
    console.error('OCR processing error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};



