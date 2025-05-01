'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      {
        tags: 'companion',
        short_name:"companion",
        is_active:1,
      },
      {
        tags: 'character',
        short_name:"character",
        is_active:1,
      },
      {
        tags: 'realistic',
        short_name:"realistic",
        is_active:1,
      },
      {
        tags: 'shy',
        short_name:"shy",
        is_active:1,
      },
      {
        tags: 'nerdy',
        short_name:"nerdy",
        is_active:1,
      },
      {
        tags: 'slowburn',
        short_name:"slowburn",
        is_active:1,
      },
      {
        tags: 'dark fantasy',
        short_name:"dark fantasy",
        is_active:1,
      },
      {
        tags: 'supernatural',
        short_name:"supernatural",
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
