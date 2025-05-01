'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacterVoiceMap extends Model {
    
    static associate(models) {
 
    }
  }
  CharacterVoiceMap.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    voice_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    character_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    modelName: 'CharacterVoiceMap',
    tableName: 'voice_character_maps',
    timestamps: false, 
    underscored: true,
  });
  return CharacterVoiceMap;
};