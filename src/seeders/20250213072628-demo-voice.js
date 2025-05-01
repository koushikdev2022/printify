'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('voices', [
      {
        voice: 'alloy',
        front_end_name:"alloy",
        gender:'male',
        link:"static/audio/alloy.mp3",
        is_active:1,
      },
      {
        voice: 'ash',
        front_end_name:"ash",
        gender:'male',
        link:"static/audio/ash.mp3",
        is_active:1,
      },
      {
        voice: 'coral',
        front_end_name:"coral",
        gender:'female',
        link:"static/audio/coral.mp3",
        is_active:1,
      },
      {
        voice: 'echo',
        front_end_name:"echo",
        gender:'male',
        link:"static/audio/echo.mp3",
        is_active:1,
      },
      {
        voice: 'fable',
        front_end_name:"fable",
        gender:'female',
        link:"static/audio/fable.mp3",
        is_active:1,
      },
      {
        voice: 'onyx',
        front_end_name:"onyx",
        gender:'male',
        link:"static/audio/onyx.mp3",
        is_active:1,
      },
      {
        voice: 'nova',
        front_end_name:"nova",
        gender:'female',
        link:"static/audio/nova.mp3",
        is_active:1,
      },

      {
        voice: 'sage',
        front_end_name:"sage",
        gender:'female',
        link:"static/audio/sage.mp3",
        is_active:1,
      },
      {
        voice: 'shimmer',
        front_end_name:"shimmer",
        gender:'female',
        link:"static/audio/shimmer.mp3",
        is_active:1,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
