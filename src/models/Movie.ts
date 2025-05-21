import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Actor from './Actor';

export enum MovieFormat {
  VHS = 'VHS',
  DVD = 'DVD',
  BLURAY = 'Blu-ray'
}

interface MovieAttributes {
  id?: number;
  title: string;
  year: number;
  format: MovieFormat;
  source?: string;
  Actors?: Actor[];
  createdAt?: Date;
  updatedAt?: Date;
}

class Movie extends Model<MovieAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public year!: number;
  public format!: MovieFormat;
  public source?: string;
  public Actors?: Actor[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


  public getActors!: () => Promise<Actor[]>;
  public setActors!: (actors: Actor[], options?: any) => Promise<void>;
  public addActor!: (actor: Actor, options?: any) => Promise<void>;
  public removeActor!: (actor: Actor) => Promise<void>;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM(...Object.values(MovieFormat)),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'movies',
  }
);

export default Movie;