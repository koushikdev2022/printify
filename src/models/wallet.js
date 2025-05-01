'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    
    static associate(models) {
        Wallet.belongsTo(models.User,{
            foreignKey:"user_id",
            as:"User"
          })
    }
  }
  Wallet.init({
    user_id: DataTypes.BIGINT,
    balance: DataTypes.FLOAT,
    account_frize: {
        type:DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_free: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    modelName: 'Wallet',
    tableName: 'wallets',
    timestamps: false,
    underscored: true,
  });
  return Wallet;
};