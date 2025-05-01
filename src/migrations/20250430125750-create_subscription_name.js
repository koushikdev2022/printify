'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_app_subscriptions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: "foreign key user table"
      },
     
      stripe_payment_key: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "stripe unique id",
      },
      customer_stripe_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "customer unique id",
      },
      stripe_subscription_type: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "trial or main"
      },
      stripe_subscription_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "start date", // Replace with your actual enum values
      },
      stripe_subscription_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "end date", // Replace with your actual enum values
      },
      subscription_type: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue:1,
        comment: "1 for active, 2 for cancel", // Replace with your actual enum values
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1, // Default value for status (1 for active)
        comment: "1 for active, 0 for inactive",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
