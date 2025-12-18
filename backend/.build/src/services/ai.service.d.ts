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
export declare class AIService {
    private openai;
    private gpt4Model;
    private gpt35Model;
    constructor();
    analyzeEntry(entry: Entry): Promise<AIAnalysis>;
    generateChatResponse(entry: Entry, chatHistory: Array<{
        role: string;
        content: string;
    }>, userMessage: string): Promise<string>;
    analyzeSentiment(text: string): Promise<SentimentAnalysis>;
    private buildAnalysisPrompt;
    private parseAnalysisResponse;
}
//# sourceMappingURL=ai.service.d.ts.map