import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING(256),
      },
      lastName: {
        type: DataTypes.STRING(256),
      },
      email: {
        type: DataTypes.STRING(256),
        unique: {
          args: 'email',
          msg: 'The email is already taken!',
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
      },
    },
    {
      underscored: true,
    },
  );

  user.addScope('user', (data) => ({
    where: {
      [Op.and]: [{ status: { [Op.ne]: 'deleted' } }, data.where],
    },
    having: data.havingWhere,
    attributes: data.attributes,
  }));

  user.addScope('userRole', (data) => ({
    include: [
      {
        model: sequelize.models.userRole,
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: sequelize.models.role,
            where: data.whereRole,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
    ],
  }));

  user.associate = (models) => {
    user.hasOne(models.userRole, { foreignKey: 'userId', onDelete: 'cascade' });
    user.hasMany(models.order, { foreignKey: 'userId' });
  };
  return user;
};
