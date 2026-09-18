import {
    verifyAccessToken
} from '../utils/jwt.js';

import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?:
            {
                userId: string,
                role: string
            }
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'User is not authenticated.' });
        }

        const payload = verifyAccessToken(token)
        req.user = {
            userId: payload.userId.toString(),
            role: payload.role.toString()
        }

        next()
    } catch (error) {
        next(error)
    }
}

