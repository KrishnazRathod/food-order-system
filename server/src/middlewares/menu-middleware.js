import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';

const { menuRepository } = repositories;

export default {
  /**
   * Check if menu item exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkMenuItemExists(req, res, next) {
    try {
      const { params: { id } } = req;
      const item = await menuRepository.getMenuItemById(id);
      if (item) {
        req.menuItem = item;
        next();
      } else {
        utility.handleResponse(req, res, false, null, 'MENU_ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },
};
