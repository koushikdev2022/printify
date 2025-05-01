'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('group_character_maps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      character_id:{
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      group_id:{
        allowNull: true,
        type: Sequelize.BIGINT,
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
