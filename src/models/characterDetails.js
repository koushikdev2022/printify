'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacterDetail extends Model {
    
    static associate(models) {
      
    }
  }
  CharacterDetail.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    avatar_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar_description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    is_active: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValues:1,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_published: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValues:0,
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
    modelName: 'CharacterDetail',
    tableName: 'character_details',
    timestamps: false, 
    underscored: true,
  });
  return CharacterDetail;
};