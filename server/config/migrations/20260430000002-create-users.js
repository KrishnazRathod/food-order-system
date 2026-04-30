'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING(256)
      },
      last_name: {
        type: Sequelize.STRING(256)
      },
      email: {
        type: Sequelize.STRING(256),
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
