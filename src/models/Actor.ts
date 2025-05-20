import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ActorAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Actor extends Model<ActorAttributes> implements ActorAttributes {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Actor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
  {
    sequelize,
    tableName: 'actors',
  }
);

export default Actor;