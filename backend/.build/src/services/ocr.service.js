"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRService = void 0;
const vision_1 = require("@google-cloud/vision");
const storage_service_1 = require("./storage.service");
class OCRService {
    constructor() {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE;
        if (!projectId || !keyFilename) {
            throw new Error('Google Cloud credentials not configured');
        }
        this.visionClient = new vision_1.ImageAnnotatorClient({
            projectId,
            keyFilename,
        });
        this.storageService = new storage_service_1.StorageService();
    }
    async processImage(imageUrl) {
        try {
            // Perform handwriting recognition
            const [result] = await this.visionClient.documentTextDetection({
                image: { source: { imageUri: imageUrl } },
            });
            const fullTextAnnotation = result.fullTextAnnotation;
            if (!fullTextAnnotation) {
                return {
                    text: '',
                    confidence: 0,
                };
            }
            // Calculate average confidence
            let totalConfidence = 0;
            let confidenceCount = 0;
            if (fullTextAnnotation.pages) {
                for (const page of fullTextAnnotation.pages) {
                    if (page.blocks) {
                        for (const block of page.blocks) {
                            if (block.paragraphs) {
                                for (const paragraph of block.paragraphs) {
                                    if (paragraph.words) {
                                        for (const word of paragraph.words) {
                                            if (word.confidence) {
                                                totalConfidence += word.confidence;
                                                confidenceCount++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const averageConfidence = confidenceCount > 0
                ? totalConfidence / confidenceCount
                : 0;
            return {
                text: fullTextAnnotation.text || '',
                confidence: averageConfidence,
            };
        }
        catch (error) {
            console.error('OCR processing error:', error);
            throw new Error(`Failed to process OCR: ${error}`);
        }
    }
    async processImages(imageUrls) {
        const results = await Promise.all(imageUrls.map(url => this.processImage(url)));
        // Combine all text
        const combinedText = results
            .map(r => r.text)
            .filter(t => t.length > 0)
            .join('\n\n');
        // Calculate average confidence
        const validResults = results.filter(r => r.confidence > 0);
        const averageConfidence = validResults.length > 0
            ? validResults.reduce((sum, r) => sum + r.confidence, 0) / validResults.length
            : 0;
        return {
            text: combinedText,
            confidence: averageConfidence,
        };
    }
}
exports.OCRService = OCRService;
//# sourceMappingURL=ocr.service.js.map