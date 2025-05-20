import { Movie, Actor } from '../../models';

export interface IMovieService {
  createMovie(data: {
    title: string;
    year: number;
    format: string;
    actors?: string[];
  }): Promise<Movie | null>;

  deleteMovie(id: number): Promise<boolean>;

  updateMovie(id: number, data: {
    title?: string;
    year?: number;
    format?: string;
    actors?: string[];
  }): Promise<Movie | null>;

  getMovieById(id: number): Promise<Movie | null>;
}