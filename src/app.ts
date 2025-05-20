import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import movieRoutes from './routes/movie.routes';
import initModels from './models/init';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/movies`, movieRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 1,
    message: 'Welcome to Movies API',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
initModels()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}${API_PREFIX}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

export default app;