# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build babel code
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy built code and production dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/config ./config
COPY --from=builder /app/.sequelizerc ./

# Install sequelize-cli globally for migrations
RUN npm install -g sequelize-cli

EXPOSE 5011

# Start the server with migrations
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/index.js"]
