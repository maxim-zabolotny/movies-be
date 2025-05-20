import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { MovieService } from '../services/movie.service';
import { logger } from '../utils/logger';
import { ErrorCodes } from '../utils/constants';

export class MovieController extends BaseController {
  private movieService: MovieService;

  constructor() {
    super();
    this.movieService = new MovieService();
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, year, format, actors } = req.body;

      const movie = await this.movieService.createMovie({
        title,
        year,
        format,
        actors
      });

      this.sendSuccess(res, movie);
    } catch (error: any) {
      logger.error('Error in MovieController.create:', error);
      
      if (error.message === ErrorCodes.MOVIE_EXISTS) {
        this.sendError(res, ErrorCodes.MOVIE_EXISTS, {
          title: 'Movie with these details already exists'
        });
      } else {
        this.sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR);
      }
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        this.sendError(res, 'INVALID_ID', {
          id: 'Invalid movie ID'
        });
        return;
      }

      const { title, year, format, actors } = req.body;
      const movie = await this.movieService.updateMovie(id, {
        title,
        year,
        format,
        actors
      });

      this.sendSuccess(res, movie);
    } catch (error: any) {
      logger.error('Error in MovieController.update:', error);
      
      if (error.message === ErrorCodes.MOVIE_NOT_FOUND) {
        this.sendError(res, ErrorCodes.MOVIE_NOT_FOUND, {
          id: parseInt(req.params.id),
        });
      } else if (error.message === ErrorCodes.MOVIE_EXISTS) {
        this.sendError(res, ErrorCodes.MOVIE_EXISTS, {
          title: 'Movie with these details already exists'
        });
      } else if (error.message === ErrorCodes.FORMAT_ERROR) {
        this.sendError(res, ErrorCodes.FORMAT_ERROR, {
          format: req.body.format,
        });
      } else {
        this.sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR);
      }
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        this.sendError(res, 'INVALID_ID', {
          id: req.params.id,
        });
        return;
      }

      const success = await this.movieService.deleteMovie(id);
      
      if (success) {
        this.sendSuccess(res, { message: 'Movie deleted successfully' });
      }
    } catch (error: any) {
      logger.error('Error in MovieController.delete:', error);
      
      if (error.message === ErrorCodes.MOVIE_NOT_FOUND) {
        this.sendError(res, ErrorCodes.MOVIE_NOT_FOUND, {
          id: parseInt(req.params.id),
        });
      } else {
        this.sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR);
      }
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        this.sendError(res, ErrorCodes.INVALID_ID, {
          id: req.params.id
        });
        return;
      }

      const movie = await this.movieService.getMovieById(id);
      this.sendSuccess(res, movie);
    } catch (error: any) {
      logger.error('Error in MovieController.getById:', error);
      
      if (error.message === ErrorCodes.MOVIE_NOT_FOUND) {
        this.sendError(res, ErrorCodes.MOVIE_NOT_FOUND, {
          id: parseInt(req.params.id)
        });
      } else {
        this.sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR);
      }
    }
  };
}