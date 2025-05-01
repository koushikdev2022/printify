"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscriptionModel extends Model {
    static associate(models) {
      SubscriptionModel.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"User"
      })
      SubscriptionModel.belongsTo(models.Plan,{
        foreignKey:"plan_id",
        as:"Plan"
      })
    }
  }
  SubscriptionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: DataTypes.BIGINT,
      plan_id:DataTypes.BIGINT,
      stripe_payment_key: DataTypes.STRING,
      customer_stripe_id: DataTypes.STRING,
      stripe_subscription_type: DataTypes.STRING,
      stripe_subscription_start_date: DataTypes.DATE,
      stripe_subscription_end_date: DataTypes.DATE,
      subscription_type: DataTypes.TINYINT,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SubscriptionModel",
      tableName: "user_app_subscriptions",
      underscored: true,
      timestamps: false,
    }
  );
  return SubscriptionModel;
};