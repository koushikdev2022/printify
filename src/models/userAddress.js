'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    
    static associate(models) {
      UserAddress.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"User"
      })
      UserAddress.hasMany(models.Transaction,{
        foreignKey:"address_id",
        as:"Transaction"
      })
    }
  }
  UserAddress.init({
    user_id: DataTypes.BIGINT,
    address_line1: DataTypes.STRING,
    address_line2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    country: DataTypes.STRING,
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_primary: {
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
    modelName: 'UserAddress',
    tableName: 'user_addresses',
    timestamps: false,
    underscored: true,
  });
  return UserAddress;
};