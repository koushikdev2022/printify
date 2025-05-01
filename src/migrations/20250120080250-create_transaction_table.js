'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      plan_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      total_balance: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      transaction_type: {
        allowNull: false,
        type: Sequelize.ENUM('debit', 'credit'),
      },
      transaction_success: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue:"success"
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
