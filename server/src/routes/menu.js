import { Router } from 'express';
import controllers from '../controllers';
import validations from '../validations';
import middlewares from '../middlewares';

const router = Router();
const { menuValidator } = validations;
const { menuController } = controllers;
const { authMiddleware, validateMiddleware, resourceAccessMiddleware } = middlewares;

/**
 * Route to list all menu items (public)
 */
router.get(
  '/',
  menuController.getMenuItems,
);

/**
 * Route to get a single menu item (public)
 */
router.get(
  '/:id',
  menuController.getMenuItem,
);

/**
 * Route to create a menu item (admin only)
 * Middleware: Auth + Admin role + Validate
 */
router.post(
  '/',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: menuValidator.createMenuItemSchema }),
  menuController.createMenuItem,
);

/**
 * Route to update a menu item (admin only)
 * Middleware: Auth + Admin role + Validate
 */
router.put(
  '/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: menuValidator.updateMenuItemSchema }),
  menuController.updateMenuItem,
);

/**
 * Route to delete a menu item (admin only, soft delete)
 * Middleware: Auth + Admin role
 */
router.delete(
  '/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  menuController.deleteMenuItem,
);

export default router;
