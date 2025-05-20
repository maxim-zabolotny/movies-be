import { User } from '../models';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ErrorCodes } from '../utils/constants';
import { logger } from '../utils/logger';

interface ISessionService {
    createSession(data: {
        email: string;
        password: string;
    }): Promise<{ token: string; status: number }>;
}

export class SessionService implements ISessionService {
    async createSession(data: {
        email: string;
        password: string;
    }): Promise<{ token: string; status: number }> {
        try {
            const user = await User.findOne({
                where: { email: data.email }
            });

            if (!user) {
                throw new Error(ErrorCodes.AUTHENTICATION_FAILED);
            }

            const isPasswordValid = await user.comparePassword(data.password);
            if (!isPasswordValid) {
                throw new Error(ErrorCodes.AUTHENTICATION_FAILED);
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            return {
                token,
                status: 1
            };
        } catch (error: any) {
            logger.error('Error in SessionService.createSession:', error);
            throw error;
        }
    }
} 