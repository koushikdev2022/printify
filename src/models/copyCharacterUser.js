'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CopyCharacterUser extends Model {
    
    static associate(models) {
    
    }
  }
  CopyCharacterUser.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    character_id:{
        allowNull: false,
        type: Sequelize.BIGINT,
    },
    user_id:{
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
    modelName: 'CopyCharacterUser',
    tableName: 'copy_character_users',
    timestamps: false, 
    underscored: true,
  });
  return CopyCharacterUser;
};