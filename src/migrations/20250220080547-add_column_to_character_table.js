'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('characters', 'public', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:0,
      after: 'example_message', // Position the column after 'is_completed'
    })
    await queryInterface.addColumn('characters', 'is_publish', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:0,
      after: 'public', // Position the column after 'is_completed'
    })
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
