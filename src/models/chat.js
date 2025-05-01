'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    
    static associate(models) {
      Chat.belongsTo(models.AiCharacter,{
        foreignKey:"character_id",
        as:"AiCharacter"
      })
    }
  }
  Chat.init({
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
    user_message_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ai_message_id: {
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
    modelName: 'Chat',
    tableName: 'user_ai_message_info',
    timestamps: false, 
    underscored: true,
  });
  return Chat;
};