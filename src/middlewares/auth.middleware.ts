import {
    verifyAccessToken
} from '../utils/jwt.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { isTokenBlacklisted } from '../modules/auth/auth.blacklist.js'
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

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_hai_ye'
        ) as JwtPayload;

        console.log(decoded);

        if (decoded.jti && await isTokenBlacklisted(decoded.jti)) {
            res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
            return;
        }


        ///  req.user=decoded

        next()
    } catch (error) {
        next(error)
    }
}

