import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: console.log
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export const initDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    await sequelize.sync({ force: true });
    console.log('Database tables have been created successfully.');
  } catch (error) {
    console.error('Unable to create database tables:', error);
    throw error;
  }
};

export default sequelize;