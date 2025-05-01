'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacterTagMap extends Model {
    static associate(models) {
 
    }
  }
  CharacterTagMap.init({
    tags_id:DataTypes.BIGINT,
    character_id:DataTypes.BIGINT,
    is_active:{
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
    modelName: 'CharacterTagMap',
    tableName: 'character_tag_maps',
    timestamps: false,
    underscored: true,
  });
  return CharacterTagMap;
};