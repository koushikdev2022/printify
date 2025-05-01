'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('predefined_characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      character_uniqe_id:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      character_name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      dob:{
        allowNull: true,
        type: Sequelize.DATE,
      },
      gender:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatar:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      background_story:{
        allowNull: true,
        type: Sequelize.TEXT('long'),
      },
      character_greeting:{
        allowNull: true,
        type: Sequelize.TEXT('long'),
      },
      is_active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:1,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
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
