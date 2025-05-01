'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "plans",
      "plan_type",
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn(
      "plans",
      "plan_price",
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
