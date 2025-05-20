import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface MovieActorAttributes {
  movieId: number;
  actorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class MovieActor extends Model<MovieActorAttributes> implements MovieActorAttributes {
  public movieId!: number;
  public actorId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MovieActor.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'movies',
        key: 'id',
      },
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'actors',
        key: 'id',
      },
    }
  },
  {
    sequelize,
    tableName: 'movie_actors',
  }
);

export default MovieActor;