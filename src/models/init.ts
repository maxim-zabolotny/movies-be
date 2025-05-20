import sequelize from '../config/database';

// Initialize all models
const initModels = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // Verify tables were created
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Created tables:', tables);
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

export default initModels; 