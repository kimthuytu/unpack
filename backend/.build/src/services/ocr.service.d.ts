export interface OCRResult {
    text: string;
    confidence: number;
}
export declare class OCRService {
    private visionClient;
    private storageService;
    constructor();
    processImage(imageUrl: string): Promise<OCRResult>;
    processImages(imageUrls: string[]): Promise<OCRResult>;
}
//# sourceMappingURL=ocr.service.d.ts.map