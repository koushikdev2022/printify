'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_slots', [
      {
        user_id: 1,
        character_slot:2,
        group_slot:1,
        is_active:1,
        is_deleted:0
      },
      {
        user_id: 3,
        character_slot:2,
        group_slot:1,
        is_active:1,
        is_deleted:0
      },
      {
        user_id: 4,
        character_slot:2,
        group_slot:1,
        is_active:1,
        is_deleted:0
      },
      {
        user_id: 5,
        character_slot:2,
        group_slot:1,
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
