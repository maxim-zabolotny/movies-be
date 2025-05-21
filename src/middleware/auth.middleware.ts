import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { ErrorCodes } from '../utils/constants';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(200).json({
            status: 0,
            error: {
                fields: {
                    token: "REQUIRED"
                },
                code: "FORMAT_ERROR"
            }
        });
        return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        res.status(200).json({
            status: 0,
            error: {
                fields: {
                    token: "REQUIRED"
                },
                code: "FORMAT_ERROR"
            }
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(200).json({
            status: 0,
            error: {
                fields: {
                    token: "REQUIRED"
                },
                code: "FORMAT_ERROR"
            }
        });
        return;
    }
}; 