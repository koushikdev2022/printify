'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttributeVideo extends Model {
    
    static associate(models) {
        AttributeVideo.belongsTo(models.Video,{
            foreignKey:"video_id",
            as:"Video"
        })
    }
  }
  AttributeVideo.init({
    username: DataTypes.STRING,
    video_id: DataTypes.BIGINT,
    attributes: DataTypes.JSON,
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
    modelName: 'AttributeVideo',
    tableName: 'attribute_videos',
    timestamps: false,
    underscored: true,
  });
  return AttributeVideo;
};