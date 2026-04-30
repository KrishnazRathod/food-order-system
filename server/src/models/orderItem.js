module.exports = (sequelize, DataTypes) => {
  const orderItem = sequelize.define(
    'orderItem',
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  orderItem.associate = (models) => {
    orderItem.belongsTo(models.order, { foreignKey: 'orderId', onDelete: 'cascade' });
    orderItem.belongsTo(models.menuItem, { foreignKey: 'menuItemId' });
  };

  return orderItem;
};
