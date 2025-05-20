import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Movie extends Model {
    public id!: number;
    public title!: string;
    public year!: string;
    public format!: string;
    public source?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        format: {
            type: DataTypes.STRING,
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