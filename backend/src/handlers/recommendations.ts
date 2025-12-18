import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserIdFromEvent } from '../utils/auth';
import { EntryService } from '../services/entry.service';
import axios from 'axios';

const entryService = new EntryService();
const SUBSTACK_API_BASE = 'https://substack.com/api/v1';

export const getRecommendations = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromEvent(event);

    // Get user's recent entries to understand themes
    const entries = await entryService.listEntries(userId, 10);

    // Extract themes from entries (simplified - in production, use AI to extract themes)
    const themes = extractThemes(entries);

    // Fetch recommendations from Substack
    // Note: This is a placeholder - actual Substack API integration would go here
    const recommendations = await fetchSubstackRecommendations(themes);

    return {
      statusCode: 200,
      body: JSON.stringify({ recommendations }),
    };
  } catch (error: any) {
    console.error('Get recommendations error:', error);
    return {
      statusCode: error.message === 'Unauthorized' ? 401 : 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

function extractThemes(entries: any[]): string[] {
  // Simplified theme extraction
  // In production, use AI to analyze entries and extract themes
  const commonThemes = [
    'mental health',
    'self-improvement',
    'mindfulness',
    'relationships',
    'work',
    'creativity',
  ];

  return commonThemes.slice(0, 3);
}

async function fetchSubstackRecommendations(themes: string[]): Promise<any[]> {
  try {
    // Placeholder - actual Substack API integration
    // Substack doesn't have a public API, so this would need to be implemented
    // based on their available endpoints or RSS feeds
    
    return [
      {
        id: '1',
        title: 'Sample Article',
        url: 'https://example.com',
        excerpt: 'A recommended article based on your journal themes',
        author: 'Author Name',
        publication: 'Publication Name',
      },
    ];
  } catch (error) {
    console.error('Substack API error:', error);
    return [];
  }
}


