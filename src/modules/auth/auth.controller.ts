import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashed,
    verifyAccessToken
} from '../../utils/jwt.js';
const REFRESH_COOKIE_PATH = '/auth/refresh';

import { Request, Response, NextFunction } from 'express';


export const loginhandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });


        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ "message": "Invalid email or password" });
        }

        const payload = {
            userId: user.id,
            role: user.role
        };

        const AccessToken = generateAccessToken(payload);
        const RefreshToken = generateRefreshToken(payload);
        const hashedrefreshtoken = hashed(RefreshToken as string);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.refreshTokens.create({
            data: {
                userId: user.id,
                token: hashedrefreshtoken,
                expiresAt: expiresAt
            }
        });

        res.cookie('accessToken', AccessToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', RefreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            "message": "User logged in",
            accessToken: AccessToken,
            
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const registerhandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, password } = req.body;
    console.log("--- REFRESH ENDPOINT HIT ---");
    console.log("Headers:", req.headers);
    console.log("Cookies Object:", req.cookies);
    try {
        const existing = await prisma.user.findFirst({ where: { email } });
        if (existing) {
            return res.status(400).json({ "message": "Email is already registered." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({
            success: true,
            message: "User is registered.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};
export const refreshTokenhandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ "message": "Refresh token is missing." });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const hashedRefToken = hashed(refreshToken);

        const storedToken = await prisma.refreshTokens.findFirst({
            where: { token: hashedRefToken }
        });

        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            return res.status(403).json({ "message": "Invalid or revoked refresh token" });
        }

        const AccessToken = generateAccessToken({
            userId: decoded.userId,
            role: decoded.role
        });

        res.cookie('accessToken', AccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: "Token refreshed successfully.",
            accessToken: AccessToken
        });
    } catch (error) {
        next(error);
    }
};

export const logouthandler = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    try {
        if(!refreshToken)
            {
                return res.json(
                    {
                        "message":"Response token is missing...."
                    })
            }
        if (refreshToken) {
            const hashedToken = hashed(refreshToken);
            await prisma.refreshTokens.deleteMany({
                where: { token: hashedToken }
            });
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.clearCookie('refreshToken', {
            //httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {

        next(error);
    }
};
