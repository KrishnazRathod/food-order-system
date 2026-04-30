import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';
import constant from '../constant';

const { orderRepository } = repositories;
const { commonConstant } = constant;

export default {
  /**
   * Place a new order
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async createOrder(req, res, next) {
    try {
      const result = await orderRepository.createOrder(req);
      if (result.status === 'item_unavailable') {
        utility.handleResponse(req, res, false, null, 'ORDER_ITEM_UNAVAILABLE', HttpStatus.BAD_REQUEST);
      } else {
        // Start auto-simulation if socket is available
        if (req.app.get('io')) {
          const io = req.app.get('io');
          const orderId = result.id;
          const userId = req.user.id;
          const statusFlow = commonConstant.ORDER_STATUS_FLOW;
          let currentIndex = 0;

          const simulateStatus = setInterval(async () => {
            currentIndex += 1;
            if (currentIndex < statusFlow.length) {
              const newStatus = statusFlow[currentIndex];
              await orderRepository.updateOrderStatus(orderId, newStatus);
              io.to(`user:${userId}`).emit('order:statusUpdate', {
                orderId,
                status: newStatus,
                updatedAt: new Date(),
              });
              if (newStatus === commonConstant.ORDER_STATUS.DELIVERED) {
                clearInterval(simulateStatus);
              }
            } else {
              clearInterval(simulateStatus);
            }
          }, 30000); // 30 seconds interval
        }

        utility.handleResponse(req, res, true, result, 'ORDER_CREATED', HttpStatus.CREATED);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all orders
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getOrders(req, res, next) {
    try {
      const result = await orderRepository.getOrders(req);
      utility.handleResponse(req, res, true, result, 'ORDER_LIST', HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getOrder(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await orderRepository.getOrderById(id);
      if (result) {
        utility.handleResponse(req, res, true, result, 'ORDER_DETAIL', HttpStatus.OK);
      } else {
        utility.handleResponse(req, res, false, null, 'ORDER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update order status (admin only)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { params: { id }, body: { status } } = req;

      // Validate current status
      const currentOrder = await orderRepository.getOrderById(id);
      if (!currentOrder) {
        return utility.handleResponse(req, res, false, null, 'ORDER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      if (currentOrder.status === commonConstant.ORDER_STATUS.DELIVERED) {
        return utility.handleResponse(req, res, false, null, 'ORDER_ALREADY_DELIVERED', HttpStatus.BAD_REQUEST);
      }
      if (currentOrder.status === commonConstant.ORDER_STATUS.CANCELLED) {
        return utility.handleResponse(req, res, false, null, 'ORDER_ALREADY_CANCELLED', HttpStatus.BAD_REQUEST);
      }

      const result = await orderRepository.updateOrderStatus(id, status);

      // Emit Socket.IO event
      if (req.app.get('io')) {
        const io = req.app.get('io');
        io.to(`user:${currentOrder.userId}`).emit('order:statusUpdate', {
          orderId: parseInt(id, 10),
          status,
          updatedAt: new Date(),
        });
      }

      return utility.handleResponse(req, res, true, result, 'ORDER_STATUS_UPDATED', HttpStatus.OK);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Cancel an order (admin only)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async cancelOrder(req, res, next) {
    try {
      const { params: { id } } = req;
      const currentOrder = await orderRepository.getOrderById(id);
      if (!currentOrder) {
        return utility.handleResponse(req, res, false, null, 'ORDER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      if (currentOrder.status === commonConstant.ORDER_STATUS.DELIVERED) {
        return utility.handleResponse(req, res, false, null, 'ORDER_ALREADY_DELIVERED', HttpStatus.BAD_REQUEST);
      }

      const result = await orderRepository.cancelOrder(id);

      // Emit Socket.IO event
      if (req.app.get('io')) {
        const io = req.app.get('io');
        io.to(`user:${currentOrder.userId}`).emit('order:statusUpdate', {
          orderId: parseInt(id, 10),
          status: commonConstant.ORDER_STATUS.CANCELLED,
          updatedAt: new Date(),
        });
      }

      return utility.handleResponse(req, res, true, result, 'ORDER_CANCELLED', HttpStatus.OK);
    } catch (error) {
      return next(error);
    }
  },
};
