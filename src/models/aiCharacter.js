'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AiCharacter extends Model {
    
    static associate(models) {
      AiCharacter.belongsTo(models.User,{
        foreignKey:"user_id",
        as:"User"
      })
      AiCharacter.hasMany(models.Chat,{
        foreignKey:"character_id",
        as:"Chat"
      })
      AiCharacter.belongsToMany(models.Voice,{
        foreignKey:"character_id",
        as:"Voice",
        through:models.CharacterVoiceMap
      })
      AiCharacter.belongsToMany(models.Tag,{
        foreignKey:"character_id",
        as:"Tag",
        through:models.CharacterTagMap
      })
      AiCharacter.belongsToMany(models.Group,{
        foreignKey:"character_id",
        as:"Group",
        through:models.GroupMap
    })
    AiCharacter.hasMany(models.GroupAiMessage,{
        foreignKey:"character_id",
        as:"GroupAiMessage",
      })
    }
  }
  AiCharacter.init({
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
    character_uniqe_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    product: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    ideal_coustomer: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    b2b:{
        allowNull: true,
        comments:"1 yes 2 no",
        type: DataTypes.TINYINT
    },
    age_start:{
        allowNull: true,
        comments:"range start of the age",
        type: DataTypes.INTEGER,
    },
    age_end:{
        allowNull: true,
        comments:"end of the age",
        type: DataTypes.INTEGER,
    },
    country:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
    },
    job_role:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
    },
    key_problem:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
    },
    buying_product:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
      },
      concerns:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
      },
      upload_google:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
      },
      avtar_goal:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
      },
      specific_campain:{
        allowNull: true,
        comments:"",
        type: DataTypes.STRING,
      },
      avatar:{
        allowNull: true,
        type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    character_details_name:{
      allowNull: true,
      type: DataTypes.STRING,
    },
    character_details_description:{
      allowNull: true,
      type: DataTypes.TEXT('long'),
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
    modelName: 'AiCharacter',
    tableName: 'ai_characters',
    timestamps: false, 
    underscored: true,
  });
  return AiCharacter;
};