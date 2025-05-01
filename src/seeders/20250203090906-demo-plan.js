'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('plans', [
      {
        plan_name: 'Gold',
        price:50,
        credit:100,
        currency:"usd",
        is_active:1,

      },
      {
        plan_name: 'Dimond',
        price:100,
        credit:120,
        currency:"usd",
        is_active:1,
        
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
