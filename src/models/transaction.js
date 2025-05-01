'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    
    static associate(models) {
        Transaction.belongsTo(models.User,{
            foreignKey:"user_id",
            as:"User"
        })
        Transaction.belongsTo(models.Plan,{
          foreignKey:"plan_id",
          as:"Plan"
        })
        Transaction.belongsTo(models.UserAddress,{
          foreignKey:"address_id",
          as:"UserAddress"
        })
    }
  }
  Transaction.init({
    user_id: DataTypes.BIGINT,
    plan_id: DataTypes.BIGINT,
    address_id: DataTypes.BIGINT,
    total_balance: DataTypes.FLOAT,
    total_credit: DataTypes.INTEGER,
    payment_intend:DataTypes.INTEGER,
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
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: false,
    underscored: true,
  });
  return Transaction;
};