'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "ai_characters",
      "character_details_name",
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn(
      "ai_characters",
      "character_details_description",
      {
        allowNull: true,
        type: Sequelize.TEXT('long')
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
