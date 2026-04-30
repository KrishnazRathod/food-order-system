import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';

const { menuItem } = models;

export default {
  /**
   * Get all menu items with optional filtering
   * @param {Object} req
   * @returns {Object} - Menu items list with count
   */
  async getMenuItems(req) {
    try {
      const {
        query: {
          search, category, limit, offset, sortBy, sortType,
        },
      } = req;

      const where = { isAvailable: true };

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      if (category) {
        where.category = category;
      }

      let orderBy = [['createdAt', 'DESC']];
      const validSortFields = ['name', 'price', 'category', 'createdAt'];
      if (sortBy && sortType && validSortFields.includes(sortBy)) {
        orderBy = [[sortBy, sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];
      }

      return await menuItem.findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 50, 10),
        offset: parseInt(offset || 0, 10),
      });
    } catch (error) {
      logMessage.menuErrorMessage('menuList', { error, data: req?.query });
      throw Error(error);
    }
  },

  /**
   * Get a single menu item by ID
   * @param {Number} id
   * @returns {Object} - Menu item
   */
  async getMenuItemById(id) {
    try {
      return await menuItem.findOne({ where: { id } });
    } catch (error) {
      logMessage.menuErrorMessage('menuDetail', { error, data: { id } });
      throw Error(error);
    }
  },

  /**
   * Create a new menu item
   * @param {Object} req
   * @returns {Object} - Created menu item
   */
  async createMenuItem(req) {
    try {
      const {
        body: {
          name, description, price, image, category, isAvailable,
        },
      } = req;
      return await menuItem.create({
        name,
        description,
        price,
        image,
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      });
    } catch (error) {
      logMessage.menuErrorMessage('menuCreate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Update a menu item
   * @param {Object} req
   * @returns {Object} - Updated menu item
   */
  async updateMenuItem(req) {
    try {
      const { params: { id }, body } = req;
      const item = await menuItem.findOne({ where: { id } });
      if (!item) return null;

      const updateData = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.image !== undefined) updateData.image = body.image;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;

      await item.update(updateData);
      return item;
    } catch (error) {
      logMessage.menuErrorMessage('menuUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Soft delete a menu item (set isAvailable to false)
   * @param {Number} id
   * @returns {Object} - Deleted menu item
   */
  async deleteMenuItem(id) {
    try {
      const item = await menuItem.findOne({ where: { id } });
      if (!item) return null;
      await item.update({ isAvailable: false });
      return item;
    } catch (error) {
      logMessage.menuErrorMessage('menuDelete', { error, data: { id } });
      throw Error(error);
    }
  },
};
