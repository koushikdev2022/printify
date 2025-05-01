'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('images', 'type', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment:"1 anime 2 photoreal",
      after: 'is_deleted', // Position the column after 'is_completed'
    });
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
