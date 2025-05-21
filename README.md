# Movies API

REST API for managing movies collection with authentication.

## Architecture

The application follows a layered architecture pattern:

- **Controllers Layer**: Handles HTTP requests and responses
- **Services Layer**: Contains business logic
- **Models Layer**: Defines database models and relationships
- **Middleware**: Handles authentication and request processing
- **Utils**: Contains helper functions and constants

## Tech Stack

- Node.js
- Express.js
- TypeScript
- SQLite
- JWT Authentication
- Docker

## Prerequisites

- Node.js
- Docker (optional)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the application:
```bash
npm run dev
```

The API will be available at `http://localhost:8000/api/v1`

## Docker

### Using Pre-built Image

The easiest way to run the application is using the pre-built Docker image:

```bash
# Pull the image
docker pull owerlord118/movies

# Run container
docker run --name movies -p 8000:8050 -e APP_PORT=8050 -e SERVER_URL=http://localhost:8000 owerlord118/movies
```

The API will be available at `http://localhost:8000/api/v1`

### Building from Source

If you want to build the image yourself:

https://hub.docker.com/r/owerlord118/movies

```bash
# Build image
docker build -t your_username/movies .

# Run container
docker run --name movies -p 8000:8050 -e APP_PORT=8050 -e SERVER_URL=http://localhost:8000 your_username/movies
```

## API Usage

### Authentication

1. Register a new user:
```bash
curl -X POST http://localhost:8000/api/v1/users \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}'
```

2. Login to get JWT token:
```bash
curl -X POST http://localhost:8000/api/v1/sessions \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```

Use the received token in the `Authorization` header for subsequent requests:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/v1/movies
```

### API Endpoints

#### Authentication
- POST `/api/v1/sessions` - Login
- POST `/api/v1/users` - Register

#### Movies
- GET `/api/v1/movies` - Get all movies
- POST `/api/v1/movies` - Create movie
- GET `/api/v1/movies/:id` - Get movie by ID
- PATCH `/api/v1/movies/:id` - Update movie
- DELETE `/api/v1/movies/:id` - Delete movie
- POST `/api/v1/movies/import` - Import movies from file

## Environment Variables

- `APP_PORT` - Application port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `SERVER_URL` - Server URL for file uploads (default: http://localhost:8000)

## Troubleshooting

1. If you get "port already in use" error:
```bash
docker rm -f movies
```

2. If you need to rebuild the container:
```bash
docker build -t owerlord118/movies .
```

3. To check container logs:
```bash
docker logs movies
```

## Future Improvements

Here are some potential improvements for the project:

1. **Type Safety**
   - Add DTO (Data Transfer Object) types for all API endpoints
   - Implement request/response validation using class-validator

2. **Authentication & Authorization**
   - Implement token refresh mechanism
   - Add token blacklisting for logout
   - Store user sessions in Redis
   - Implement rate limiting