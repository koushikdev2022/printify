'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('images', [
      {
        image: 'static/anime/req-10o08izXsdo7gPl9fagy6.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/HpHUfAqAysE5ShPKE-glb_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/anime/req-27yhpcRJwgndoBfpuhQpa.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/qc7kmBl6frMAHoAnpuQSg_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/anime/9NG2LAYsmKuB1N4O5c3Xr_output.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/XxTgX6gy0hZ4qgQzPIhK7_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/anime/req-i2DHX2pWQztaX2rbhHKel.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/dWMCb4dRoWbA41rXhqVXX_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/anime/req-I119GRYOy1DPlihpA72eA.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/MFzZepestj2WizC9saNhN_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/anime/req-L0sru8tv4jonZV6hc6Tso.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/fJM4Yb4rmslI-Ul_Hj26H_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
   
      {
        image: 'static/anime/req-obbeAwFbtm4ywy2op2mwG.jpeg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/anim/9NG2LAYsmKuB1N4O5c3Xr_output.mp4',
        type:1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/Frame-1000001130.png',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/hUb9-FpQizSTZQEHxumlR_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/Frame-1000001131.png',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/kW1PVqTV_UfqUFxAvQFF-_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/Frame-1000001132.png',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/jTU7nIYhJLOyg-jXcqF4T_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/image_hJa82sFi_1740133708513_raw.jpg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/r08qDORfPWD1_4i1bJJpq_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/image_OUXegoF7_1740133153633_raw.jpg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/arKZM3FAkg18o83_zlc-J_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/image_qlFfSOUP_1740134059566_raw.jpg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/UXLB4D6vg1UmT6D8Qoguw_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/image_SYB8TzeB_1740136613980_raw.jpg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/bkpuvuQ3d2pyLY3b3230m_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        image: 'static/real/image_y1IXGMFr_1740133204461_raw.jpg',
        is_active: 1,
        is_deleted: 0,
        video_url:'static/real_video/photoreal/PCyF0sAwAd4_LAHW_wFAb_output.mp4',
        type:2,
        created_at: new Date(),
        updated_at: new Date()
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
