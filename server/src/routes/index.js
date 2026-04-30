/* eslint-disable prefer-regex-literals */
/* eslint-disable no-unused-vars */
import { Router } from 'express';
import HttpStatus from 'http-status';
import logger from '../services/logger';
import utility from '../services/utility';
import account from './account';
import menu from './menu';
import order from './order';

const router = Router();
const register = (app) => {
  app.use(router);

  router.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
  });

  router.use('/api/account', [account]);
  router.use('/api/menu', [menu]);
  router.use('/api/order', [order]);

  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = HttpStatus.NOT_FOUND;
    res.status(error.status).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });

  app.use((error, req, res, next) => {
    const internalError = HttpStatus.INTERNAL_SERVER_ERROR;
    if (error) {
      logger.dailyLogger('ERROR').info(`Error : ${error}`);
    }
    let statusCode = error?.status
      ? HttpStatus.BAD_REQUEST
      : internalError;
    if (error?.status === HttpStatus.UNAUTHORIZED) {
      statusCode = HttpStatus.UNAUTHORIZED;
    }
    let errorMessage = statusCode === internalError
      ? utility.getMessage(req, false, 'INTERNAL_ERROR')
      : String(error?.message)
        ?.replace(new RegExp('Error:', 'g'), '')
        ?.trim();
    if (error.errorCode === 1) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorMessage = String(error)
        ?.replace(new RegExp('Error:', 'g'), '')
        ?.trim();
    }
    res.status(statusCode).json({
      success: false,
      data: null,
      error,
      message: errorMessage,
    });
  });
};
export default register;
