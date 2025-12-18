import { Entry } from '../models/entry.model';
export declare class EntryService {
    createEntry(userId: string, images: string[]): Promise<Entry>;
    getEntry(id: string): Promise<Entry | null>;
    updateEntry(entry: Entry): Promise<Entry>;
    listEntries(userId: string, limit?: number): Promise<Entry[]>;
    deleteEntry(id: string): Promise<void>;
}
//# sourceMappingURL=entry.service.d.ts.map