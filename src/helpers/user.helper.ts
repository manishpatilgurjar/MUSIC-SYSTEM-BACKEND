import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/users';
import dotenv from "dotenv";
dotenv.config();
// Secret keys used to sign/verify tokens
const accessTokenSecret =process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET !;

export function generateAccessToken(userId: string): string {
    try {
        return jwt.sign({ userId }, accessTokenSecret, { expiresIn: '1d' });
    } catch (error) {
        throw new Error('Failed to generate access token');
    }
}

export function generateLongLivedAccessToken(userId: string): string {
    try {
        return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: '60d' });
    } catch (error) {
        throw new Error('Failed to generate long-lived access token');
    }
}
export const verifyAccessToken = async (accessToken: string) => {
    try {
        // Verify the access token using the access token secret key
        const decoded = jwt.verify(accessToken, accessTokenSecret) as { userId: string, exp: number };

        // Extract user information from the decoded token
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the token has expired
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimeInSeconds) {
            throw new Error('Access token has expired');
        }

        return user; // Return the user document
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

export const verifyRefreshToken = async (refreshToken: string) => {
    try {
        // Verify the refresh token using the refresh token secret key
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as { userId: string, exp: number };
        // Extract user information from the decoded token
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if the token has expired
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimeInSeconds) {
            throw new Error('Refresh token has expired');
        }
        return { user };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

