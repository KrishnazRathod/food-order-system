module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    'order',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        defaultValue: 'received',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      deliveryName: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      deliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deliveryPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      underscored: true,
    },
  );

  order.associate = (models) => {
    order.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'cascade' });
    order.hasMany(models.orderItem, { foreignKey: 'orderId', onDelete: 'cascade' });
  };

  return order;
};
