import Movie from './Movie';
import Actor from './Actor';
import MovieActor from './MovieActor';

Movie.belongsToMany(Actor, { through: MovieActor });
Actor.belongsToMany(Movie, { through: MovieActor });

export {
  Movie,
  Actor,
  MovieActor
};