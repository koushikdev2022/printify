'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('characters', 'is_completed', {
      type: Sequelize.INTEGER, 
      allowNull: true,  
      defaultValue:0,      
      after: 'is_active',
    });
    await queryInterface.addColumn('characters', 'is_deleted', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        after: 'is_completed', // Position the column after 'is_completed'
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
