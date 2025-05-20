import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ErrorCodes } from '../utils/constants';
import { logger } from '../utils/logger';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, name, password, confirmPassword } = req.body;

            if (!email || !name || !password || !confirmPassword) {
                res.status(200).json({
                    status: 0,
                    error: {
                        code: ErrorCodes.REQUIRED,
                        fields: {
                            email: !email ? 'Email is required' : undefined,
                            name: !name ? 'Name is required' : undefined,
                            password: !password ? 'Password is required' : undefined,
                            confirmPassword: !confirmPassword ? 'Confirm password is required' : undefined
                        }
                    }
                });
                return;
            }

            const result = await this.userService.createUser({
                email,
                name,
                password,
                confirmPassword
            });

            res.status(200).json(result);
        } catch (error: any) {
            logger.error('Error in UserController.create:', error);

            if (error.message === ErrorCodes.AUTHENTICATION_FAILED) {
                res.status(400).json({
                    status: 0,
                    error: {
                        code: ErrorCodes.AUTHENTICATION_FAILED,
                        fields: {
                            password: 'Passwords do not match',
                            confirmPassword: 'Passwords do not match'
                        }
                    }
                });
                return;
            }

            if (error.message === ErrorCodes.EMAIL_NOT_UNIQUE) {
                res.status(200).json({
                    status: 0,
                    error: {
                        code: ErrorCodes.EMAIL_NOT_UNIQUE,
                        fields: {
                            email: ErrorCodes.NOT_UNIQUE
                        }
                    }
                });
                return;
            }

            res.status(500).json({
                status: 0,
                error: {
                    code: ErrorCodes.INTERNAL_SERVER_ERROR
                }
            });
        }
    }
} 