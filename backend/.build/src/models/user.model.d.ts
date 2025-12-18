export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}
export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: User;
    tokens: {
        access_token: string;
        refresh_token?: string;
    };
}
//# sourceMappingURL=user.model.d.ts.map