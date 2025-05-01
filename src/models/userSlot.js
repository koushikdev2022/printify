'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSlot extends Model {
    
    static associate(models) {
      UserSlot.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"User"
      })
    }
  }
  UserSlot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    character_slot:{
        allowNull: false,
        type: Sequelize.BIGINT,
    },
    group_slot:{
        allowNull: true,
        type: Sequelize.BIGINT,
    },
    is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'UserSlot',
    tableName: 'user_slots',
    timestamps: false, 
    underscored: true,
  });
  return UserSlot;
};