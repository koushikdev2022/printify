const { User } = require("../../../../models");
const jwt = require('jsonwebtoken');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const { mailCogfig } = require("../../../../config/mailConfig");
exports.sendMail = async (req, res) => {
    try {
        const payload = req?.body;
        const user = await User.findOne({ where: { email: payload?.email } });
        const tokenPayload = {
            user: user.id,
            time: Date.now()
        };
        //  const token = atob(tokenPayload);
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
        console.log(token)
        const resetUrl = `${payload?.base_url}/reset-password/${token}`;
        let templatePath = path.resolve(__dirname, `../../../../pages/forgetPassword.ejs`);
        const emailHtml = await ejs.renderFile(templatePath, { url: resetUrl, name: user?.first_name });
        let msg = {
            from: process.env.STMP_SENDER,
            to: user?.email,
            subject: 'Reset Your Password',
            html: emailHtml,
        };
        let transportConfig = await mailCogfig()
        let messageResponse = transportConfig.sendMail(msg)
        if (messageResponse) {
            res.status(200).json({
                status: true,
                status_code: 200,
                message: 'Email has been sent successfully',
            })
        } else {
            res.status(422).json({
                status: false,
                status_code: 422,
                message: 'Unable to send email',
            })
        }
    } catch (err) {
        console.log("Error in sendMail in forgetPasswordController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const payload = req?.body;
        // console.log(payload?.user_id);
        const password = await bcrypt.hashSync(payload?.password, 10);
        const user = await User.findByPk(payload?.user_id);
        // let updatePwd = user.password = payload?.password;
        // await user.save();
        const updatePwd = user.update({
            password: password
        });
        if (updatePwd) {
            return res.status(200).json({
                status: true,
                message: 'Updated Successfully',
                status_code: 200
            })
        } else {
            return res.status(400).json({
                status: false,
                message: 'Unable to update',
                status_code: 400
            })
        }
    } catch (err) {
        console.log("Error in sendMail in forgetPasswordController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status
        })
    }
}