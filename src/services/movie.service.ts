import { Movie, Actor } from '../models';
import { MovieFormat } from '../models/Movie';
import { IMovieService } from './interfaces/movie.service.interface';
import { logger } from '../utils/logger';
import sequelize from '../config/database';
import {ErrorCodes} from "../utils/constants";
import {Op, Sequelize} from 'sequelize';

export class MovieService implements IMovieService {
  async createMovie(data: {
    title: string;
    year: number;
    format: string;
    actors?: string[];
  }): Promise<Movie | null> {
    const transaction = await sequelize.transaction();

    try {
      const existingMovie = await Movie.findOne({
        where: {
          title: data.title,
          year: data.year,
          format: data.format
        },
        transaction
      });

      if (existingMovie) {
        throw new Error(ErrorCodes.MOVIE_EXISTS);
      }

      const movie = await Movie.create({
        title: data.title,
        year: data.year,
        format: data.format as MovieFormat
      }, { transaction });

      if (data.actors && data.actors.length > 0) {
        // Create actors sequentially to avoid SQLITE_BUSY errors
        for (const name of data.actors) {
          const [actor] = await Actor.findOrCreate({
            where: { name: name.trim() },
            transaction
          });
          await movie.addActor(actor, { transaction });
        }
      }

      await transaction.commit();

      // Fetch the complete movie with actors after transaction is committed
      return await Movie.findByPk(movie.id, {
        include: [Actor]
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in MovieService.createMovie:', error);
      throw error;
    }
  }

  async deleteMovie(id: number): Promise<boolean> {
    const transaction = await sequelize.transaction();

    try {
      const movie = await Movie.findByPk(id, {
        include: [Actor],
        transaction
      });

      if (!movie) {
        throw new Error(ErrorCodes.MOVIE_NOT_FOUND);
      }

      // Remove all actor associations
      await movie.setActors([], { transaction });

      // Delete the movie
      await movie.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in MovieService.deleteMovie:', error);
      throw error;
    }
  }

  async updateMovie(id: number, data: {
    title?: string;
    year?: number;
    format?: string;
    actors?: string[];
  }): Promise<Movie | null> {
    const transaction = await sequelize.transaction();

    try {
      const movie = await Movie.findByPk(id, {
        include: [Actor],
        transaction
      });

      if (!movie) {
        throw new Error(ErrorCodes.MOVIE_NOT_FOUND);
      }

      // Check if movie with same details exists (excluding current movie)
      if (data.title && data.year && data.format) {
        const existingMovie = await Movie.findOne({
          where: {
            title: data.title,
            year: data.year,
            format: data.format,
            id: { [Op.ne]: id }
          },
          transaction
        });

        if (existingMovie) {
          throw new Error(ErrorCodes.MOVIE_EXISTS);
        }
      }

      // Update movie details
      if (data.title) movie.title = data.title;
      if (data.year) movie.year = data.year;
      if (data.format) {
        if (!Object.values(MovieFormat).includes(data.format as MovieFormat)) {
          throw new Error(ErrorCodes.FORMAT_ERROR);
        }
        movie.format = data.format as MovieFormat;
      }

      await movie.save({ transaction });

      // Update actors if provided
      if (data.actors) {
        // Remove existing actors
        await movie.setActors([], { transaction });

        // Add new actors
        for (const name of data.actors) {
          const [actor] = await Actor.findOrCreate({
            where: { name: name.trim() },
            transaction
          });
          await movie.addActor(actor, { transaction });
        }
      }

      await transaction.commit();

      // Fetch updated movie with actors
      return await Movie.findByPk(id, {
        include: [Actor]
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in MovieService.updateMovie:', error);
      throw error;
    }
  }

  async getMovieById(id: number): Promise<Movie | null> {
    try {
      const movie = await Movie.findByPk(id, {
        include: [Actor]
      });

      if (!movie) {
        throw new Error(ErrorCodes.MOVIE_NOT_FOUND);
      }

      return movie;
    } catch (error) {
      logger.error('Error in MovieService.getMovieById:', error);
      throw error;
    }
  }

  async getAllMovies(params: {
    actor?: string;
    title?: string;
    search?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }): Promise<{
    data: Omit<Movie, 'Actors'>[];
    meta: { total: number };
    status: number;
  }> {
    const {
      actor,
      title,
      search,
      sort = 'id',
      order = 'ASC',
      limit = 10,
      offset = 0
    } = params;

    const where: any = {};
    const include: any[] = [];

    include.push({
      model: Actor,
      required: false
    });

    if (actor) {
      include[0].required = true;
      include[0].where = {
        name: {
          [Op.like]: `%${actor}%`
        }
      };
    }

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`
      };
    }

    if (search) {
      include[0].required = false;
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        Sequelize.literal(`EXISTS (
        SELECT 1 FROM movie_actors AS ma
        INNER JOIN actors AS a ON a.id = ma.actorId
        WHERE ma.movieId = Movie.id AND a.name LIKE '%${search}%'
      )`)
      ];
    }

    const movies = await Movie.findAll({
      where,
      include,
      order: [[sort, order]],
      limit,
      offset
    });

    const total = await Movie.count({
      where,
      include
    });

    const cleanedMovies = movies.map((movie: any) => {
      const { Actors, ...rest } = movie.get({ plain: true });
      return rest;
    });

    return {
      data: cleanedMovies,
      meta: { total },
      status: 1
    };
  }

}