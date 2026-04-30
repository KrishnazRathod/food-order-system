/* eslint-disable no-unused-vars */
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import Bootstrap from './app';
import socketService from './services/socket';
import config from './config';

dotenv.config();
const app = express();
const port = process.env.PORT || 5011;
app.set('port', port);

// Initialize Bootstrap (middleware, db, routes)
const bootstrap = new Bootstrap(app);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketService.init(server, config.app.clientUrl);
app.set('io', io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server has started on port ${port}`);
});

export default server;
