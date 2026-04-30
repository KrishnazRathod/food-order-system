import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';
import constant from '../constant';

const { orderRepository } = repositories;
const { commonConstant } = constant;

export default {
  /**
   * Check if order exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkOrderExists(req, res, next) {
    try {
      const { params: { id } } = req;
      const orderRecord = await orderRepository.getOrderById(id);
      if (orderRecord) {
        req.order = orderRecord;
        next();
      } else {
        utility.handleResponse(req, res, false, null, 'ORDER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check if user owns the order (or is admin)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkOrderOwner(req, res, next) {
    try {
      const { params: { id }, user: currentUser, userRole } = req;
      if (userRole === commonConstant.ROLE.ADMIN) {
        return next();
      }
      const orderRecord = await orderRepository.getOrderById(id);
      if (orderRecord && orderRecord.userId === currentUser.id) {
        return next();
      }
      return utility.handleResponse(req, res, false, null, 'ORDER_ACCESS_DENIED', HttpStatus.FORBIDDEN);
    } catch (error) {
      return next(error);
    }
  },
};
