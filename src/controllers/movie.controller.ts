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

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        actor,
        title,
        search,
        sort = 'title',
        order = 'ASC',
        limit,
        offset
      } = req.query;

      const result = await this.movieService.getAllMovies({
        actor: actor as string,
        title: title as string,
        search: search as string,
        sort: sort as string,
        order: order as 'ASC' | 'DESC',
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined
      });

      res.json({
        status: 1,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      logger.error('Error in getAll:', error);
      res.status(500).json({
        status: 0,
        error: {
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: ErrorCodes.INTERNAL_SERVER_ERROR
        }
      });
    }
  };

  public importMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        this.sendError(res, ErrorCodes.REQUIRED, {
          message: 'No file uploaded'
        });
        return;
      }

      const result = await this.movieService.importMoviesFromFile(req.file.path);

      res.json({
        status: 1,
        data: result.movies,
        meta: {
          imported: result.imported,
          total: result.total
        }
      });
    } catch (error) {
      logger.error('Error in MovieController.importMovies:', error);
      this.sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR);
    }
  };
}