# Task Sync

A real-time task management application built with Angular 17 and Express/TypeScript, featuring WebSocket integration for seamless real-time updates across devices.

## Features

- **User Authentication**: Secure register and login system with JWT
- **Task Management**: Create, read, update, and delete tasks with ease
- **Kanban Board**: Organize tasks by status (To Do, In Progress, Done)
- **Priority Levels**: Assign Low, Medium, or High priority to tasks
- **Real-time Updates**: Changes sync instantly across all connected clients via WebSockets
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean Architecture**: Follows industry best practices and design patterns

## Tech Stack

### Frontend
- **Angular 17** with standalone components
- **NgRx** for state management
- **Socket.IO** client for real-time updates
- **SCSS** for styling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** for data persistence
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **InversifyJS** for dependency injection

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ladoxer/task-sync.git
   cd task-sync
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   
   # Create a .env file with your configuration
   echo "NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task-sync
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:4200" > .env
   
   # Start the development server
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Access the application** at http://localhost:4200

### Environment Variables

For the server, create a `.env` file with these variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-sync
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:4200
```

## Docker Deployment

1. **Build and run the application with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application** at http://localhost:4200

## Project Structure

```
task-sync/
├── client/                       # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Core functionality
│   │   │   ├── features/         # Feature modules
│   │   │   │   ├── auth/         # Authentication components
│   │   │   │   └── tasks/        # Task management components and state
│   │   │   └── shared/           # Shared components
│   │   ├── environments/         # Environment configurations
│   │   └── assets/               # Static assets
│   └── Dockerfile                # Client Docker configuration
│
├── server/                       # Express backend
│   ├── src/
│   │   ├── api/                  # API layer
│   │   ├── core/                 # Core functionality
│   │   ├── domain/               # Domain layer (business logic)
│   │   ├── infrastructure/       # Infrastructure layer
│   │   ├── app.ts                # Express app setup
│   │   └── server.ts             # Entry point
│   └── Dockerfile                # Server Docker configuration
│
└── docker-compose.yml           # Docker Compose configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## WebSocket Events

- `task:created` - Emitted when a new task is created
- `task:updated` - Emitted when a task is updated
- `task:deleted` - Emitted when a task is deleted

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Future Improvements

- Task filtering and sorting
- User profile management
- Team collaboration features
- Task comments and attachments
- Dark mode theme
- Task due dates and reminders
- Statistics and reporting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Angular](https://angular.io/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [NgRx](https://ngrx.io/)
- [InversifyJS](https://inversify.io/)

---

Made with ❤️ by [Ladoxer](https://github.com/Ladoxer)