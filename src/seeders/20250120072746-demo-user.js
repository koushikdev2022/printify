'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'srk',
        password: await bcrypt.hashSync('password1',10),
        full_name: 'srk',
        first_name: 'srk',
        last_name: 'Doe',
        email: 'srk@yopmail.com',
        role: 2,
        phone: '1234567890',
        dob: '1990-01-01',
        avatar: 'avatar1.jpg',
        otp: '123456',
        otp_expaired_at: '2025-01-30',
        refresh_token: 'refresh_token_yopmail_1',
        is_active: 1,
        is_verify: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'admin',
        password: await bcrypt.hashSync('admin',10),
        full_name: 'admin Smith',
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@yopmail.com',
        role: 1,
        phone: '0987654321',
        dob: '1992-02-02',
        avatar: 'avatar2.jpg',
        otp: '654321',
        otp_expaired_at: '2025-02-15',
        refresh_token: 'refresh_token_yopmail_2',
        is_active: 1,
        is_verify: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'user3',
        password: await bcrypt.hashSync('password3',10),
        full_name: 'Alice Wonderland',
        first_name: 'Alice',
        last_name: 'Wonderland',
        email: 'alice.wonderland@yopmail.com',
        role: 3,
        phone: '1231231234',
        dob: '1985-05-10',
        avatar: 'avatar3.jpg',
        otp: '456123',
        otp_expaired_at: '2025-03-01',
        refresh_token: 'refresh_token_yopmail_3',
        is_active: 1,
        is_verify: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'user4',
        password: await bcrypt.hashSync('password4',10),
        full_name: 'Bob Builder',
        first_name: 'Bob',
        last_name: 'Builder',
        email: 'bob.builder@yopmail.com',
        role: 1,
        phone: '4564564567',
        dob: '1980-07-20',
        avatar: 'avatar4.jpg',
        otp: '789012',
        otp_expaired_at: '2025-03-05',
        refresh_token: 'refresh_token_yopmail_4',
        is_active: 1,
        is_verify: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'user5',
        password: await bcrypt.hashSync('password5',10),
        full_name: 'Charlie Brown',
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie.brown@yopmail.com',
        role: 2,
        phone: '7897897890',
        dob: '1995-12-25',
        avatar: 'avatar5.jpg',
        otp: '345678',
        otp_expaired_at: '2025-04-01',
        refresh_token: 'refresh_token_yopmail_5',
        is_active: 0,
        is_verify: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * yopmail:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
