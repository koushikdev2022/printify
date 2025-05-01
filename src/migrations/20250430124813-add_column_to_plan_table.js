'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "plans",
      "plan_key",
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn(
      "plans",
      "product_key",
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
