import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ErrorCodes } from '../utils/constants';
import { logger } from '../utils/logger';

interface IUserService {
    createUser(data: {
        email: string;
        name: string;
        password: string;
        confirmPassword: string;
    }): Promise<{ token: string; status: number }>;
}

export class UserService implements IUserService {
    async createUser(data: {
        email: string;
        name: string;
        password: string;
        confirmPassword: string;
    }): Promise<{ token: string; status: number }> {
        try {
            if (data.password !== data.confirmPassword) {
                throw new Error(ErrorCodes.AUTHENTICATION_FAILED);
            }

            const existingUser = await User.findOne({
                where: { email: data.email }
            });

            if (existingUser) {
                throw new Error(ErrorCodes.EMAIL_NOT_UNIQUE);
            }

            const user = await User.create({
                email: data.email,
                name: data.name,
                password: data.password
            });

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
            logger.error('Error in UserService.createUser:', error);
            throw error;
        }
    }
} 