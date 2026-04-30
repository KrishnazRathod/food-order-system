import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';

const { menuRepository } = repositories;

export default {
  /**
   * Get all menu items
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getMenuItems(req, res, next) {
    try {
      const result = await menuRepository.getMenuItems(req);
      utility.handleResponse(req, res, true, result, 'MENU_ITEM_LIST', HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single menu item
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getMenuItem(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await menuRepository.getMenuItemById(id);
      if (result) {
        utility.handleResponse(req, res, true, result, 'MENU_ITEM_DETAIL', HttpStatus.OK);
      } else {
        utility.handleResponse(req, res, false, null, 'MENU_ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new menu item (admin only)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async createMenuItem(req, res, next) {
    try {
      const result = await menuRepository.createMenuItem(req);
      utility.handleResponse(req, res, true, result, 'MENU_ITEM_CREATED', HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a menu item (admin only)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async updateMenuItem(req, res, next) {
    try {
      const result = await menuRepository.updateMenuItem(req);
      if (result) {
        utility.handleResponse(req, res, true, result, 'MENU_ITEM_UPDATED', HttpStatus.OK);
      } else {
        utility.handleResponse(req, res, false, null, 'MENU_ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a menu item (admin only, soft delete)
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async deleteMenuItem(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await menuRepository.deleteMenuItem(id);
      if (result) {
        utility.handleResponse(req, res, true, result, 'MENU_ITEM_DELETED', HttpStatus.OK);
      } else {
        utility.handleResponse(req, res, false, null, 'MENU_ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },
};
