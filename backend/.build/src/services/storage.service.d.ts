export declare class StorageService {
    uploadImage(imageBuffer: Buffer, contentType: string): Promise<string>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    getPublicUrl(key: string): Promise<string>;
}
//# sourceMappingURL=storage.service.d.ts.map