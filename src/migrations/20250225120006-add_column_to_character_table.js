'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.addColumn('characters', 'parent_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after: 'video_url', // Position the column after 'is_completed'
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
