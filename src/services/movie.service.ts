import { Movie, Actor } from '../models';
import { MovieFormat } from '../models/Movie';
import { IMovieService } from './interfaces/movie.service.interface';
import { logger } from '../utils/logger';
import sequelize from '../config/database';

export class MovieService implements IMovieService {
  async createMovie(data: {
    title: string;
    year: number;
    format: string;
    actors?: string[];
  }): Promise<Movie | null> {
    const transaction = await sequelize.transaction();

    try {
      if (!Object.values(MovieFormat).includes(data.format as MovieFormat)) {
        throw new Error('INVALID_FORMAT');
      }

      const existingMovie = await Movie.findOne({
        where: {
          title: data.title,
          year: data.year,
          format: data.format
        },
        transaction
      });

      if (existingMovie) {
        throw new Error('MOVIE_EXISTS');
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
}