"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const auth_1 = require("../utils/auth");
const validators_1 = require("../utils/validators");
const uuid_1 = require("uuid");
// In production, use a proper user database/service
// For MVP, this is a simplified version
const users = new Map();
const signup = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        // Validate input
        if (!(0, validators_1.validateRequired)(body.email) || !(0, validators_1.validateEmail)(body.email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email' }),
            };
        }
        if (!(0, validators_1.validateRequired)(body.password) || !(0, validators_1.validatePassword)(body.password)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Password must be at least 8 characters' }),
            };
        }
        if (!(0, validators_1.validateRequired)(body.name)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Name is required' }),
            };
        }
        // Check if user exists
        if (users.has(body.email)) {
            return {
                statusCode: 409,
                body: JSON.stringify({ error: 'User already exists' }),
            };
        }
        // Create user (in production, hash password properly)
        const userId = (0, uuid_1.v4)();
        const user = {
            id: userId,
            email: body.email,
            name: body.name,
            password: body.password, // In production, hash this!
            createdAt: new Date().toISOString(),
        };
        users.set(body.email, user);
        // Generate token
        const token = (0, auth_1.generateToken)({ userId, email: body.email });
        const response = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            tokens: {
                access_token: token,
            },
        };
        return {
            statusCode: 201,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Signup error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
exports.signup = signup;
const login = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        // Validate input
        if (!(0, validators_1.validateRequired)(body.email) || !(0, validators_1.validateEmail)(body.email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email' }),
            };
        }
        if (!(0, validators_1.validateRequired)(body.password)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Password is required' }),
            };
        }
        // Find user
        const user = users.get(body.email);
        if (!user || user.password !== body.password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid credentials' }),
            };
        }
        // Generate token
        const token = (0, auth_1.generateToken)({ userId: user.id, email: user.email });
        const response = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            tokens: {
                access_token: token,
            },
        };
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map