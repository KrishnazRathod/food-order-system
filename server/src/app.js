/* eslint-disable class-methods-use-this */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from './routes';
import models from './models';
import config from './config';
import loggers from './services/logger';

/**
 * Application startup class
 */
export default class Bootstrap {
  /**
   * Creates an instance of Bootstrap.
   * @param {object} app
   */
  constructor(app) {
    this.app = app;
    this.middleware();
    this.connectDb();
    this.routes();
  }

  /**
   * Load all middleware
   * @memberOf Bootstrap
   */
  middleware() {
    const { app } = this;
    const swaggerDefinition = {
      info: {
        title: 'REST API for Food Order System',
        version: '1.0.0',
        description: 'This is the REST API for Food Order Management System',
      },
      host: `${config.app.swaggerHost}`,
      basePath: '/api',
      securityDefinitions: {
        BearerAuth: {
          type: 'apiKey',
          description: 'JWT authorization of an API',
          name: 'Authorization',
          in: 'header',
        },
      },
    };

    const options = {
      swaggerDefinition,
      apis: ['./api-docs/*.yaml'],
    };

    const swaggerSpec = swaggerJSDoc(options);
    app.use(cors({
      origin: config.app.clientUrl || 'http://localhost:5173',
      credentials: true,
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(compression());
    app.use(methodOverride());
    if (config.app.environment === 'development') {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
    app.use('/public', express.static(`${__dirname}/../public`));
    app.use(
      helmet({
        contentSecurityPolicy: false,
        referrerPolicy: false,
        originAgentCluster: false,
      }),
    );
    app.use((req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  /**
   * Check database connection
   */
  connectDb() {
    const { sequelize } = models;
    sequelize.authenticate().then(async () => {
      loggers.dailyLogger('dbStatus').info('Database connected successfully');
      await sequelize.sync().then(() => {
        loggers.dailyLogger('dbStatus').info('Database synchronized successfully');
      }).catch((error) => {
        loggers.dailyLogger('dbStatus').error(new Error(`Database synchronization error: ${error}`));
      });
    }).catch((error) => {
      loggers.dailyLogger('dbStatus').error(new Error(`Database connection error: ${error}`));
    });
  }

  /**
   * Load all routes
   */
  routes() {
    routes(this.app);
  }
}
