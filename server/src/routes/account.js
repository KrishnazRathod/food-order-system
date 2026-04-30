import { Router } from 'express';
import controllers from '../controllers';
import validations from '../validations';
import middlewares from '../middlewares';

const router = Router();
const { accountValidator } = validations;
const { accountController } = controllers;
const { authMiddleware, validateMiddleware } = middlewares;

/**
 * Route for user registration
 * Middleware: Validate registration data
 * Controller function for user registration
 */
router.post(
  '/register',
  validateMiddleware({ schema: accountValidator.registerSchema }),
  accountController.register,
);

/**
 * Route for user login
 * Middleware: Validate login data
 * Controller function for user login
 */
router.post(
  '/login',
  validateMiddleware({ schema: accountValidator.loginSchema }),
  accountController.login,
);

/**
 * Route to get current user profile
 * Middleware: Ensure user is authenticated
 * Controller function to get profile
 */
router.get(
  '/me',
  authMiddleware,
  accountController.getProfile,
);

export default router;
