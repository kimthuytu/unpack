import { APIGatewayProxyEvent } from 'aws-lambda';
export interface JWTPayload {
    userId: string;
    email: string;
}
export declare function generateToken(payload: JWTPayload): string;
export declare function verifyToken(token: string): JWTPayload;
export declare function getUserIdFromEvent(event: APIGatewayProxyEvent): string;
//# sourceMappingURL=auth.d.ts.map