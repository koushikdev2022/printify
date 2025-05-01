'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voice extends Model {
    
    static associate(models) {
        Voice.belongsToMany(models.AiCharacter,{
            foreignKey:"voice_id",
            as:"AiCharacter",
            through:models.CharacterVoiceMap
          })
    }
  }
  Voice.init({
    voice: DataTypes.STRING,
    front_end_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    link: DataTypes.STRING,
    is_active: {
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
    modelName: 'Voice',
    tableName: 'voices',
    timestamps: false,
    underscored: true,
  });
  return Voice;
};