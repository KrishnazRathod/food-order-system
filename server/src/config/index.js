import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export default {
  app: {
    siteName: process.env.SITE_NAME,
    baseUrl: process.env.BASE_URL,
    clientUrl: process.env.CLIENT_URL,
    environment: process.env.NODE_ENV,
    swaggerHost: process.env.SWAGGER_HOST,
    languages: ['en'],
  },
  database: {
    mysql: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      db: process.env.DB_NAME,
      timezone: '+00:00',
    },
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpireIn: process.env.JWT_EXPIRE_IN,
};
