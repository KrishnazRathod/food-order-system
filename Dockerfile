# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install --prefix server

# Copy source and config
COPY server/src ./server/src
COPY server/.babelrc ./server/

# Build babel code
RUN npm run build --prefix server

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy built code and dependencies from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/config ./server/config

# Install sequelize-cli for migrations
RUN npm install -g sequelize-cli

EXPOSE 5011

# Start the server with migrations
CMD ["sh", "-c", "cd server && npx sequelize-cli db:migrate && node dist/index.js"]
