'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('slot_prices', [
      {
        character_slot_total: 2,
        group_slot_total:1,
        price:0,
        free:1,
        is_active:1,
        is_deleted:0
      },
      {
        character_slot_total: 1,
        group_slot_total:0,
        price:10,
        free:1,
        is_active:1,
        is_deleted:0
      },
      {
        character_slot_total: 0,
        group_slot_total:1,
        price:20,
        free:1,
        is_active:1,
        is_deleted:0
      },
      {
        character_slot_total: 1,
        group_slot_total:1,
        price:25,
        free:1,
        is_active:1,
        is_deleted:0
      },
      {
        character_slot_total: 3,
        group_slot_total:2,
        price:45,
        free:1,
        is_active:1,
        is_deleted:0
      },
      {
        character_slot_total: 5,
        group_slot_total:3,
        price:65,
        free:1,
        is_active:1,
        is_deleted:0
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
