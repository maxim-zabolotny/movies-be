import { Response, Request } from 'express';
import { logger } from '../utils/logger';
import { ErrorCodes, ErrorCode } from '../utils/constants';

export class BaseController {
  /**
   * Send success response
   */
  protected sendSuccess<T>(res: Response, data: T): Response {
    const response = {
      status: 1,
      data
    };

    logger.info(`Success response: ${JSON.stringify(response)}`);
    return res.status(200).json(response);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    code: ErrorCode,
    fields?: Record<string, string>
  ): Response {
    const response = {
      status: 0,
      error: {
        code: ErrorCodes[code],
        ...(fields && { fields })
      }
    };

    logger.error(`Error response: ${JSON.stringify(response)}`);
    return res.status(200).json(response);
  }

  /**
   * Get pagination parameters from request
   */
  protected getPaginationParams(req: Request): { page: number; limit: number } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );

    return { page, limit };
  }
}