import Movie from './Movie';
import Actor from './Actor';
import MovieActor from './MovieActor';

Movie.belongsToMany(Actor, { 
  through: MovieActor,
  foreignKey: 'movieId',
  otherKey: 'actorId'
});

Actor.belongsToMany(Movie, { 
  through: MovieActor,
  foreignKey: 'actorId',
  otherKey: 'movieId'
});

export {
  Movie,
  Actor,
  MovieActor
};