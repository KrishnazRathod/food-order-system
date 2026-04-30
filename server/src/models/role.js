module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    'role',
    {
      role: {
        type: DataTypes.STRING(50),
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      underscored: true,
    },
  );

  role.loadScopes = () => {
    role.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  return role;
};
