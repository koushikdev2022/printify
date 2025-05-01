'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      address_line1:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      address_line2:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      city:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      state:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      postal_code:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      country:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:1,
      },
      is_primary: {
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
