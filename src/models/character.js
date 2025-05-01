'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    
    static associate(models) {
      Character.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"User"
      })
      Character.hasMany(models.Chat,{
        foreignKey:"character_id",
        as:"Chat"
      })
      Character.belongsToMany(models.Voice,{
        foreignKey:"character_id",
        as:"Voice",
        through:models.CharacterVoiceMap
      })
      Character.belongsToMany(models.Tag,{
        foreignKey:"character_id",
        as:"Tag",
        through:models.CharacterTagMap
      })
      Character.belongsToMany(models.Group,{
        foreignKey:"character_id",
        as:"Group",
        through:models.GroupMap
    })
      Character.hasMany(models.GroupAiMessage,{
        foreignKey:"character_id",
        as:"GroupAiMessage",
      })
    }
  }
  Character.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    response_derective:DataTypes.TEXT('long'),
    key_memory:DataTypes.TEXT('long'),
    example_message:DataTypes.TEXT('long'),
    video_url:DataTypes.STRING,
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    character_uniqe_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    character_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    background_story: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    character_greeting: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    parent_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    public: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_publish: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    type:{
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment:"1 anime 2 photoreal",
      after: 'is_deleted', // Position the column after 'is_completed'
    },
    is_completed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_deleted: {
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
    modelName: 'Character',
    tableName: 'characters',
    timestamps: false, 
    underscored: true,
  });
  return Character;
};