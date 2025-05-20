import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
    uploadsPath: '/uploads'
}; 