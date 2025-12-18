import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SignUpRequest, LoginRequest, AuthResponse } from '../models/user.model';
import { generateToken } from '../utils/auth';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';
import { v4 as uuidv4 } from 'uuid';

// In production, use a proper user database/service
// For MVP, this is a simplified version
const users: Map<string, any> = new Map();

export const signup = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}') as SignUpRequest;

    // Validate input
    if (!validateRequired(body.email) || !validateEmail(body.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email' }),
      };
    }

    if (!validateRequired(body.password) || !validatePassword(body.password)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password must be at least 8 characters' }),
      };
    }

    if (!validateRequired(body.name)) {
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
    const userId = uuidv4();
    const user = {
      id: userId,
      email: body.email,
      name: body.name,
      password: body.password, // In production, hash this!
      createdAt: new Date().toISOString(),
    };

    users.set(body.email, user);

    // Generate token
    const token = generateToken({ userId, email: body.email });

    const response: AuthResponse = {
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
  } catch (error) {
    console.error('Signup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const login = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}') as LoginRequest;

    // Validate input
    if (!validateRequired(body.email) || !validateEmail(body.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email' }),
      };
    }

    if (!validateRequired(body.password)) {
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
    const token = generateToken({ userId: user.id, email: user.email });

    const response: AuthResponse = {
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
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};


