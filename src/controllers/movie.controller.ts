import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { MovieService } from '../services/movie.service';
import { logger } from '../utils/logger';

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
      
       if (error.message === 'MOVIE_EXISTS') {
        this.sendError(res, 'MOVIE_EXISTS', {
          title: 'Movie with these details already exists'
        });
      } else {
        this.sendError(res, 'INTERNAL_SERVER_ERROR');
      }
    }
  };
}