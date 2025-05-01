'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('characters', 'response_derective', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      after: 'is_deleted', // Position the column after 'is_completed'
    })
    await queryInterface.addColumn('characters', 'key_memory', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      after: 'response_derective', // Position the column after 'is_completed'
    })
    await queryInterface.addColumn('characters', 'example_message', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      after: 'key_memory', // Position the column after 'is_completed'
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
