import { Router } from 'express';
import controllers from '../controllers';
import validations from '../validations';
import middlewares from '../middlewares';

const router = Router();
const { orderValidator } = validations;
const { orderController } = controllers;
const {
  authMiddleware, validateMiddleware, resourceAccessMiddleware, orderMiddleware,
} = middlewares;

/**
 * Route to place a new order (authenticated users)
 * Middleware: Auth + Validate
 */
router.post(
  '/',
  authMiddleware,
  validateMiddleware({ schema: orderValidator.createOrderSchema }),
  orderController.createOrder,
);

/**
 * Route to list orders (authenticated, user sees own, admin sees all)
 * Middleware: Auth
 */
router.get(
  '/',
  authMiddleware,
  orderController.getOrders,
);

/**
 * Route to get order detail (authenticated, must own or be admin)
 * Middleware: Auth + checkOrderOwner
 */
router.get(
  '/:id',
  authMiddleware,
  orderMiddleware.checkOrderOwner,
  orderController.getOrder,
);

/**
 * Route to update order status (admin only)
 * Middleware: Auth + Admin role + Validate
 */
router.patch(
  '/:id/status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: orderValidator.updateOrderStatusSchema }),
  orderController.updateOrderStatus,
);

/**
 * Route to cancel an order (admin only)
 * Middleware: Auth + Admin role
 */
router.delete(
  '/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  orderController.cancelOrder,
);

export default router;
