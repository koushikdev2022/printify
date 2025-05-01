'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    
    static associate(models) {
        Group.belongsTo(models.User,{
            foreignKey:"user_id",
            as:"User"
        })
        Group.belongsToMany(models.AiCharacter,{
            foreignKey:"group_id",
            as:"AiCharacter",
            through:models.GroupMap
        })
        Group.hasMany(models.GroupAiMessage,{
            foreignKey:"group_id",
            as:"GroupAiMessage",
          
        })
    }
  }
  Group.init({
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
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    group_image: {
        type: DataTypes.STRING,
        allowNull: true,
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
    modelName: 'Group',
    tableName: 'groups',
    timestamps: false, 
    underscored: true,
  });
  return Group;
};