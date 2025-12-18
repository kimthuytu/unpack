import OpenAI from 'openai';
import { Entry } from '../models/entry.model';

export interface SentimentAnalysis {
  label: string;
  score: number;
}

export interface AIAnalysis {
  summary: string;
  sentiment: SentimentAnalysis;
  emotions: string[];
  keySentences: string[];
  followUpQuestions: string[];
}

export class AIService {
  private openai: OpenAI;
  private gpt4Model = 'gpt-4';
  private gpt35Model = 'gpt-3.5-turbo';

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async analyzeEntry(entry: Entry): Promise<AIAnalysis> {
    if (!entry.ocrText || entry.ocrText.trim().length === 0) {
      throw new Error('Entry text is required for analysis');
    }

    const prompt = this.buildAnalysisPrompt(entry.ocrText);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.gpt4Model,
        messages: [
          {
            role: 'system',
            content: `You are a compassionate AI companion helping someone reflect on their journal entry. 
            Use therapeutic approaches (CBT, ACT, IFS-informed) to provide gentle, encouraging insights.
            Be empathetic and validate emotions without toxic positivity.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      return this.parseAnalysisResponse(content);
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`Failed to analyze entry: ${error}`);
    }
  }

  async generateChatResponse(
    entry: Entry,
    chatHistory: Array<{ role: string; content: string }>,
    userMessage: string
  ): Promise<string> {
    const systemPrompt = `You are a therapeutic AI companion helping someone reflect on their journal entry.
    The journal entry is: "${entry.ocrText?.substring(0, 1000)}..."
    
    Use therapeutic approaches (CBT, ACT, IFS-informed) to:
    - Validate their emotions
    - Ask thoughtful follow-up questions
    - Help them discover insights
    - Be gentle, encouraging, and helpful
    - Avoid toxic positivity
    
    Keep responses conversational and under 200 words.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: this.gpt4Model,
        messages: messages as any,
        temperature: 0.8,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || 'I apologize, I had trouble processing that. Could you rephrase?';
    } catch (error) {
      console.error('Chat response error:', error);
      throw new Error(`Failed to generate chat response: ${error}`);
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const prompt = `Analyze the sentiment of this journal entry. Return ONLY a JSON object with "label" (one of: positive, negative, neutral) and "score" (0.0 to 1.0).

Text: "${text.substring(0, 500)}"

Return JSON only:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.gpt35Model, // Use cheaper model for sentiment
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content.trim());
      
      return {
        label: parsed.label || 'neutral',
        score: parsed.score || 0.5,
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      // Default fallback
      return { label: 'neutral', score: 0.5 };
    }
  }

  private buildAnalysisPrompt(text: string): string {
    return `Analyze this journal entry and provide:
1. A brief summary (2-3 sentences)
2. Sentiment analysis (label: positive/negative/neutral, score: 0.0-1.0)
3. List of emotions detected (3-5 emotions)
4. Key sentences or insights (3-5 sentences that stand out)
5. Thoughtful follow-up questions (2-3 questions)

Journal entry:
"${text}"

Return your response as JSON:
{
  "summary": "...",
  "sentiment": {"label": "...", "score": 0.0},
  "emotions": ["...", "..."],
  "keySentences": ["...", "..."],
  "followUpQuestions": ["...", "..."]
}`;
  }

  private parseAnalysisResponse(content: string): AIAnalysis {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          sentiment: parsed.sentiment || { label: 'neutral', score: 0.5 },
          emotions: parsed.emotions || [],
          keySentences: parsed.keySentences || [],
          followUpQuestions: parsed.followUpQuestions || [],
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback response
    return {
      summary: content.substring(0, 200),
      sentiment: { label: 'neutral', score: 0.5 },
      emotions: [],
      keySentences: [],
      followUpQuestions: [],
    };
  }
}


