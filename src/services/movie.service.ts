import { Movie, Actor } from '../models';
import { MovieFormat } from '../models/Movie';
import { IMovieService } from './interfaces/movie.service.interface';
import { logger } from '../utils/logger';

export class MovieService implements IMovieService {
  async createMovie(data: {
    title: string;
    year: number;
    format: string;
    actors?: string[];
  }): Promise<Movie | null> {
    try {
      if (!Object.values(MovieFormat).includes(data.format as MovieFormat)) {
        throw new Error('INVALID_FORMAT');
      }

      const existingMovie = await Movie.findOne({
        where: {
          title: data.title,
          year: data.year,
          format: data.format
        }
      });

      if (existingMovie) {
        throw new Error('MOVIE_EXISTS');
      }

      const movie = await Movie.create({
        title: data.title,
        year: data.year,
        format: data.format as MovieFormat
      });

      if (data.actors && data.actors.length > 0) {
        const actorInstances = await Promise.all(
          data.actors.map(async (name: string) => {
            const [actor] = await Actor.findOrCreate({
              where: { name: name.trim() }
            });
            return actor;
          })
        );

        await movie.setActors(actorInstances);
      }

      return await Movie.findByPk(movie.id, {
        include: [Actor]
      });
    } catch (error) {
      logger.error('Error in MovieService.createMovie:', error);
      throw error;
    }
  }
}