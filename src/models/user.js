'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
        User.hasMany(models.AiCharacter,{
          foreignKey:"user_id",
          as:"AiCharacter"
        })
        User.hasMany(models.Group,{
          foreignKey:"user_id",
          as:"Group"
        })
        User.hasMany(models.UserAddress,{
          foreignKey:"user_id",
          as:"UserAddress"
        })
        User.hasOne(models.Wallet,{
          foreignKey:"user_id",
          as:"Wallet"
        })
        User.hasOne(models.UserSlot,{
          foreignKey:"user_id",
          as:"UserSlot"
        })
        User.hasMany(models.Transaction,{
          foreignKey:"user_id",
          as:"Transaction"
        })
        User.hasMany(models.SubscriptionModel,{
          foreignKey:"user_id",
          as:"SubscriptionModel"
        })
        
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    full_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    oauth_provider:DataTypes.STRING,
    role: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.DATE,
    avatar: DataTypes.STRING,
    otp: DataTypes.STRING,
    otp_expaired_at: DataTypes.DATE,
    refresh_token: DataTypes.TEXT,
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_verify: {
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
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    underscored: true,
  });
  return User;
};