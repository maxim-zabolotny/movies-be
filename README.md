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

Build and run with Docker:

```bash
# Build image
docker build -t your_super_account/movies .

# Run container
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_super_account/movies
```

## API Endpoints

### Authentication
- POST `/api/v1/sessions` - Login
- POST `/api/v1/users` - Register

### Movies
- GET `/api/v1/movies` - Get all movies
- POST `/api/v1/movies` - Create movie
- GET `/api/v1/movies/:id` - Get movie by ID
- PATCH `/api/v1/movies/:id` - Update movie
- DELETE `/api/v1/movies/:id` - Delete movie
- POST `/api/v1/movies/import` - Import movies from file

## Environment Variables

- `APP_PORT` - Application port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens 