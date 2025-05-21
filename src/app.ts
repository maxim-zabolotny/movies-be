import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import initModels from './models/init';
import routes from './routes';

dotenv.config();

const app = express();

// Настройка CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
const API_PREFIX = '/api/v1';
app.use(API_PREFIX, routes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 1,
    message: 'Welcome to Movies API',
    version: '1.0.0'
  });
});

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Initialize database and start server
initModels()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
      console.log(`API available at http://${HOST}:${PORT}${API_PREFIX}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

export default app;