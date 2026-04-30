import models from '../models';
import logMessage from '../logMessages/index';
import constant from '../constant';

const { commonConstant } = constant;
const {
  order, orderItem, menuItem, user,
} = models;

export default {
  /**
   * Create a new order with items
   * @param {Object} req
   * @returns {Object} - Created order with items
   */
  async createOrder(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          items, deliveryName, deliveryAddress, deliveryPhone, notes,
        },
        user: currentUser,
      } = req;

      // Fetch menu items and validate availability
      const menuItemIds = items.map((item) => item.menuItemId);
      const menuItems = await menuItem.findAll({
        where: { id: menuItemIds, isAvailable: true },
      });

      if (menuItems.length !== menuItemIds.length) {
        await transaction.rollback();
        return { status: 'item_unavailable' };
      }

      // Calculate total
      const menuItemMap = {};
      menuItems.forEach((mi) => {
        menuItemMap[mi.id] = mi;
      });

      let totalAmount = 0;
      const orderItemsData = items.map((item) => {
        const mi = menuItemMap[item.menuItemId];
        const unitPrice = parseFloat(mi.price);
        totalAmount += unitPrice * item.quantity;
        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice,
        };
      });

      // Create order
      const newOrder = await order.create(
        {
          userId: currentUser.id,
          status: commonConstant.ORDER_STATUS.RECEIVED,
          totalAmount: totalAmount.toFixed(2),
          deliveryName,
          deliveryAddress,
          deliveryPhone,
          notes,
        },
        { transaction },
      );

      // Create order items
      const orderItemsWithOrderId = orderItemsData.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));
      await orderItem.bulkCreate(orderItemsWithOrderId, { transaction });

      await transaction.commit();

      // Fetch complete order with items
      return await this.getOrderById(newOrder.id);
    } catch (error) {
      await transaction.rollback();
      logMessage.orderErrorMessage('orderCreate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get all orders (user sees own, admin sees all)
   * @param {Object} req
   * @returns {Object} - Orders list with count
   */
  async getOrders(req) {
    try {
      const {
        query: { limit, offset, status },
        user: currentUser,
        userRole,
      } = req;

      const where = {};
      if (userRole !== commonConstant.ROLE.ADMIN) {
        where.userId = currentUser.id;
      }
      if (status) {
        where.status = status;
      }

      return await order.findAndCountAll({
        where,
        include: [
          {
            model: orderItem,
            include: [{ model: menuItem, attributes: ['id', 'name', 'image', 'category'] }],
          },
          {
            model: user,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit || 20, 10),
        offset: parseInt(offset || 0, 10),
      });
    } catch (error) {
      logMessage.orderErrorMessage('orderList', { error, data: req?.query });
      throw Error(error);
    }
  },

  /**
   * Get a single order by ID
   * @param {Number} id
   * @returns {Object} - Order with items
   */
  async getOrderById(id) {
    try {
      return await order.findOne({
        where: { id },
        include: [
          {
            model: orderItem,
            include: [{ model: menuItem, attributes: ['id', 'name', 'image', 'category', 'price'] }],
          },
          {
            model: user,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });
    } catch (error) {
      logMessage.orderErrorMessage('orderDetail', { error, data: { id } });
      throw Error(error);
    }
  },

  /**
   * Update order status
   * @param {Number} id
   * @param {String} newStatus
   * @returns {Object} - Updated order
   */
  async updateOrderStatus(id, newStatus) {
    try {
      const orderRecord = await order.findOne({ where: { id } });
      if (!orderRecord) return null;

      await orderRecord.update({ status: newStatus });
      return await this.getOrderById(id);
    } catch (error) {
      logMessage.orderErrorMessage('orderStatusUpdate', { error, data: { id, status: newStatus } });
      throw Error(error);
    }
  },

  /**
   * Cancel an order
   * @param {Number} id
   * @returns {Object} - Cancelled order
   */
  async cancelOrder(id) {
    try {
      return await this.updateOrderStatus(id, commonConstant.ORDER_STATUS.CANCELLED);
    } catch (error) {
      logMessage.orderErrorMessage('orderCancel', { error, data: { id } });
      throw Error(error);
    }
  },
};
