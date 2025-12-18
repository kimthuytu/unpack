import { ChatMessage } from '../models/chat.model';
export declare class ChatService {
    createMessage(message: ChatMessage): Promise<ChatMessage>;
    getChatHistory(entryId: string, userId: string): Promise<ChatMessage[]>;
    createUserMessage(entryId: string, userId: string, content: string): Promise<ChatMessage>;
    createAssistantMessage(entryId: string, userId: string, content: string, context?: ChatMessage['context']): Promise<ChatMessage>;
}
//# sourceMappingURL=chat.service.d.ts.map