'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        role: 'admin',
        description: 'Administrator with full access',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'user',
        description: 'Regular customer',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
