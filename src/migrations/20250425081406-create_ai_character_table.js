'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ai_characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      character_uniqe_id:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      company_name:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      website:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      product:{
        allowNull: true,
        type: Sequelize.TEXT('long'),
      },
      ideal_coustomer:{
        allowNull: true,
        type: Sequelize.TEXT('long'),
      },
      b2b:{
        allowNull: true,
        comments:"1 yes 2 no",
        type: Sequelize.TINYINT
      },
      age_start:{
        allowNull: true,
        comments:"range start of the age",
        type: Sequelize.INTEGER,
      },
      age_end:{
        allowNull: true,
        comments:"end of the age",
        type: Sequelize.INTEGER,
      },
      country:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      job_role:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      key_problem:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      buying_product:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      concerns:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      upload_google:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      avtar_goal:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      specific_campain:{
        allowNull: true,
        comments:"",
        type: Sequelize.STRING,
      },
      avatar:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_active: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:1,
      },
      is_deleted: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValues:0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
