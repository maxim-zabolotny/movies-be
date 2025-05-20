import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { ErrorCodes } from '../utils/constants';
import { logger } from '../utils/logger';

export class SessionController {
    private sessionService: SessionService;

    constructor() {
        this.sessionService = new SessionService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(200).json({
                    status: 0,
                    error: {
                        code: ErrorCodes.REQUIRED,
                        fields: {
                            email: !email ? 'Email is required' : undefined,
                            password: !password ? 'Password is required' : undefined
                        }
                    }
                });
                return;
            }

            const result = await this.sessionService.createSession({
                email,
                password
            });

            res.status(200).json(result);
        } catch (error: any) {
            logger.error('Error in SessionController.create:', error);

            if (error.message === ErrorCodes.AUTHENTICATION_FAILED) {
                res.status(200).json({
                    status: 0,
                    error: {
                        code: ErrorCodes.AUTHENTICATION_FAILED,
                        fields: {
                            email: ErrorCodes.AUTHENTICATION_FAILED,
                            password: ErrorCodes.AUTHENTICATION_FAILED
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