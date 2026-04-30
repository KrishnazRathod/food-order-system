# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install --prefix server

# Copy everything else from the server folder
COPY server/ ./server/

# Build babel code
RUN npm run build --prefix server

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy built code and production dependencies from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/config ./server/config
COPY --from=builder /app/server/.sequelizerc ./server/

# Install sequelize-cli globally for migrations
RUN npm install -g sequelize-cli

EXPOSE 5011

# Start the server with migrations
CMD ["sh", "-c", "cd server && npx sequelize-cli db:migrate && node dist/index.js"]
