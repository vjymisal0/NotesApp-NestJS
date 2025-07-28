# Docker Setup for Notes Application

This project includes Docker configuration for both frontend and backend applications.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository** (if not already done)

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   
3. **Build and run all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

## Available Commands

### Development
```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete your data)
docker-compose down -v
```

### Production
```bash
# Build optimized images
docker-compose -f docker-compose.yml build --no-cache

# Start in production mode
docker-compose up -d
```

## Individual Service Commands

### Backend Only
```bash
# Build backend image
docker build -t notes-backend ./backend

# Run backend container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/notesdb \
  notes-backend
```

### Frontend Only
```bash
# Build frontend image
docker build -t notes-frontend .

# Run frontend container
docker run -p 80:80 notes-frontend
```

## Environment Variables

Copy `.env.example` to `.env` and modify as needed:

- `MONGO_ROOT_USERNAME`: MongoDB root username (default: admin)
- `MONGO_ROOT_PASSWORD`: MongoDB root password (default: password123)
- `MONGO_DATABASE`: MongoDB database name (default: notesdb)
- `MONGODB_URI`: Complete MongoDB connection string
- `BACKEND_PORT`: Backend service port (default: 3000)
- `FRONTEND_PORT`: Frontend service port (default: 80)
- `NODE_ENV`: Node environment (default: production)

## Architecture

The Docker setup includes:

1. **MongoDB**: Database service with persistent volume
2. **Backend**: NestJS API server
3. **Frontend**: React application served by Nginx
4. **Network**: Custom bridge network for service communication

## Health Checks

All services include health checks:
- MongoDB: Uses `mongosh` ping command
- Backend: HTTP check on port 3000 (requires `/health` endpoint)
- Frontend: HTTP check on port 80

## Notes

- The backend requires a health endpoint at `/health` for proper health checking
- MongoDB data is persisted in a Docker volume
- All services are connected via a custom bridge network
- The frontend is optimized for production with Nginx serving static files
- CORS should be configured in the backend to allow frontend requests

## Troubleshooting

1. **Port conflicts**: Modify ports in `.env` file if default ports are in use
2. **MongoDB connection issues**: Ensure MongoDB is fully started before backend
3. **Build issues**: Use `docker-compose build --no-cache` to rebuild from scratch
4. **Permission issues**: Ensure Docker daemon is running and user has permissions
