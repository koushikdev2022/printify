'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlotPrice extends Model {
    
    static associate(models) {
    
    }
  }
  SlotPrice.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    character_slot_total:{
        allowNull: false,
        type: Sequelize.BIGINT,
    },
    group_slot_total:{
        allowNull: true,
        type: Sequelize.BIGINT,
    },
    price:{
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    free: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    modelName: 'SlotPrice',
    tableName: 'slot_prices',
    timestamps: false, 
    underscored: true,
  });
  return SlotPrice;
};