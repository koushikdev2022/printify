'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupAiMessage extends Model {
    
    static associate(models) {
      GroupAiMessage.belongsTo(models.AiCharacter,{
            foreignKey:"character_id",
            as:"AiCharacter"
      })
      GroupAiMessage.belongsTo(models.Group,{
        foreignKey:"group_id",
        as:"Group"
      })
    }
  }
  GroupAiMessage.init({
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
    character_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    user_message_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ai_message_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ai_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ai_message: {
        type: DataTypes.STRING,
        allowNull: true,
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
    modelName: 'GroupAiMessage',
    tableName: 'group_ai_message_info',
    timestamps: false, 
    underscored: true,
  });
  return GroupAiMessage;
};