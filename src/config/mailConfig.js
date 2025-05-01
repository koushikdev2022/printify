require('dotenv').config();
const nodemailer = require('nodemailer');

const mailCogfig = async () => {
    let config = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587, 
        secure: process.env.SMTP_PORT == 465, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    };
    return nodemailer.createTransport(config);
};


module.exports = { mailCogfig }