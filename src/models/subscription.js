'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    
    static associate(models) {
      Subscription.belongsTo(models.Plan,{
        foreignKey:"plan_id",
        as:"Plan"
      })
    }
  }
  Subscription.init({
    subscription_provider:DataTypes.STRING,
    subscription_provider_key:DataTypes.STRING,
    user_id:DataTypes.BIGINT,
    plan_id:DataTypes.BIGINT,
    start_date:DataTypes.DATE,
    end_date:DataTypes.DATE,
    is_active:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_deleted:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: false,
    underscored: true,
  });
  return Subscription;
};