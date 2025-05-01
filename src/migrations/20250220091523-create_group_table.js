'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group_name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      group_image:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:1,
      },
      is_deleted: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:0,
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
