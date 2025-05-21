import { Movie, Actor } from '../../models';

export interface IMovieService {
  createMovie(data: {
    title: string;
    year: number;
    format: string;
    actors?: string[];
  }): Promise<{ data: any; status: number }>;

  deleteMovie(id: number): Promise<boolean>;

  updateMovie(id: number, data: {
    title?: string;
    year?: number;
    format?: string;
    actors?: string[];
  }): Promise<{ data: any; status: number }>;

  getMovieById(id: number): Promise<{ data: any; status: number }>;

  getAllMovies(params: {
    actor?: string;
    title?: string;
    search?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }): Promise<{ data: Movie[]; meta: { total: number } }>;
}