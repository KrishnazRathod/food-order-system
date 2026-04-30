module.exports = (sequelize, DataTypes) => {
  const menuItem = sequelize.define(
    'menuItem',
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.ENUM('pizza', 'burger', 'drink', 'dessert', 'side'),
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      underscored: true,
    },
  );

  menuItem.associate = (models) => {
    menuItem.hasMany(models.orderItem, { foreignKey: 'menuItemId' });
  };

  return menuItem;
};
