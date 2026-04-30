import { Server } from 'socket.io';
import jwt from './jwt';

let io = null;

export default {
  /**
   * Initialize Socket.IO on the HTTP server
   * @param {Object} server - HTTP server instance
   * @param {String} clientUrl - Client URL for CORS
   * @returns {Object} - Socket.IO instance
   */
  init(server, clientUrl) {
    io = new Server(server, {
      cors: {
        origin: clientUrl || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log(`Socket connected: ${socket.id}`);

      // Authenticate user and join their room
      socket.on('authenticate', async (token) => {
        try {
          const decoded = await jwt.verifyToken(token);
          if (decoded) {
            socket.userId = decoded.id;
            socket.join(`user:${decoded.id}`);
            socket.emit('authenticated', { userId: decoded.id });
          }
        } catch (error) {
          socket.emit('auth_error', { message: 'Invalid token' });
        }
      });

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    return io;
  },

  /**
   * Get the Socket.IO instance
   * @returns {Object} - Socket.IO instance
   */
  getIO() {
    return io;
  },
};
