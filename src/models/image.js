'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    
    static associate(models) {
       
    }
  }
  Image.init({
    image: DataTypes.STRING,
    is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment:"1 anime 2 photoreal",
        after: 'is_deleted', // Position the column after 'is_completed'
      },
    video_url:{
      type: Sequelize.STRING,
      allowNull: true,
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
    modelName: 'Image',
    tableName: 'images',
    timestamps: false,
    underscored: true,
  });
  return Image;
};