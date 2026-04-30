# Premium Food Order Management System

A full-stack food delivery application built with React, Express, MySQL, and Socket.IO.

## Features

- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.
- **Menu Management**: Browse food items by category, search for specific dishes.
- **Cart System**: Real-time cart updates and persistence.
- **Secure Auth**: JWT-based authentication for order history and tracking.
- **Real-time Tracking**: Live order status updates using Socket.IO.
- **API Documentation**: Interactive Swagger docs.
- **Comprehensive Testing**: Jest for backend API and Vitest for frontend components.

## Tech Stack

- **Frontend**: React 18, Vite, Axios, Socket.IO Client, CSS Variables.
- **Backend**: Express.js, Sequelize ORM, MySQL, Socket.IO, Joi Validation.
- **Testing**: Jest, Supertest (Backend), Vitest, React Testing Library (Frontend).

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL Server

### Installation

1. Clone the repository
2. Install dependencies for both parts:
   ```bash
   npm run install:all
   ```
3. Set up your environment variables:
   - Create `.env` in the `server/` directory (refer to `.env.example`).
   - Ensure your MySQL database `food_order_system` exists.

4. Run migrations and seed data:
   ```bash
   cd server
   npm run migration
   npm run seed:menu
   ```

5. Start the application:
   - Start backend: `npm run server`
   - Start frontend: `npm run client`

## API Documentation

Once the server is running, visit:
`http://localhost:5011/api-docs`

## Testing

Run all tests across the stack:
```bash
npm run test:all
```

## License

MIT
