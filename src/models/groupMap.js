'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMap extends Model {
    
    static associate(models) {
    
    }
  }
  GroupMap.init({
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
    group_id:{
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
    modelName: 'GroupMap',
    tableName: 'group_character_maps',
    timestamps: false, 
    underscored: true,
  });
  return GroupMap;
};