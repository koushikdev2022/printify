'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    
    static associate(models) {
      Tag.belongsToMany(models.AiCharacter,{
        foreignKey:"tags_id",
        as:"AiCharacter",
        through:models.CharacterTagMap
      })
    }
  }
  Tag.init({
    tags:DataTypes.STRING,
    short_name:DataTypes.STRING,
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
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: false,
    underscored: true,
  });
  return Tag;
};