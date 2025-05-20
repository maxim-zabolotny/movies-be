import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movie.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}${API_PREFIX}`);
});

export default app;