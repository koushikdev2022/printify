const { User ,UserSlot,SlotPrice} = require("../../../../models");
const checkPassword = require("../../../../helper/checkPassword");
const { generateAccessToken, userRefreshAccessToken } = require("../../../../helper/generateAccessToken");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { mailCogfig } = require("../../../../config/mailConfig");
const path = require("path");
const ejs = require('ejs');

const axios = require('axios');

exports.veryfyOtp = async (req,res)=>{
    try{
            const payload = req?.body
            const id = req?.body?.id
            const user = await User.findByPk(id)
            if(user){
                  if(user?.otp == payload?.otp){
                    const userUpdate = await User.update({
                        is_verify:1
                    },{where:{
                        id:id
                    }})
                    if(userUpdate){
                        return res.status(200).json({
                            status: true,
                            message: "otp verified",
                            status_code: 200
                        })
                    }else{
                        return res.status(400).json({
                            status: false,
                            message: "otp failed",
                            status_code: 400
                        })
                    }
                  }else{
                    return res.status(400).json({
                        status: true,
                        message: "invalid otp",
                        status_code: 400
                    })
                  }
            }else{
                return res.status(400).json({
                    status: true,
                    message: "no user",
                    status_code: 400
                })
            }
    }catch (err) {
        console.log("Error in register authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}

exports.resendOtp = async (req,res) =>{
    try{
        const payload = req?.body
        const id = payload?.id
        const findUser = await User.findByPk(payload?.id)
        if(findUser){
            const generateOTP = () => Math.floor(100000 + Math.random() * 900000); 
            const otp = generateOTP();
            const otpExpireTimeFormatted = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            const transporter = await mailCogfig()
            const updateOtp = await User.update(
              { 
                otp: otp, 
                otp_expaired_at: otpExpireTimeFormatted 
              },
              { where: { id } }
            );
            const emailTemplatePathOtp = path.join(__dirname,"../../../../",'templates', 'otp.ejs');
            const emailContentOtp = await ejs.renderFile(emailTemplatePathOtp, {
                first_name: findUser.first_name, 
                otp:otp
            });
            const mailOptionsOtp = {
                from: process.env.SMTP_USER,
                to: findUser?.email, 
                subject: "your otp is",
                html: emailContentOtp,
            };
            await transporter.sendMail(mailOptionsOtp);
            return res.status(200).json({
                status: true,
                message: "otp send",
                status_code: 200
            })
        }else{
            return res.status(400).json({
                status: true,
                message: "no user",
                status_code: 400
            })
        }
    }catch (err) {
        console.log("Error in register authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}
exports.register = async (req, res) => {
    try {
        const payload = req?.body;
        const pwd = await bcrypt.hashSync(payload?.password, 10);
        const reg = await User.create({
            first_name: payload?.first_name,
            last_name: payload?.last_name,
            username: payload?.username,
            email: payload?.email,
            password: pwd,
        });
        const priceDetails = await SlotPrice.findOne({
            where:{
                free:1
            }
        })
        if(priceDetails){
            const createSlot = await UserSlot.create({
                character_slot:priceDetails?.character_slot_total,
                group_slot:priceDetails?.group_slot_total,
                user_id:reg?.id
            })
        }
        const token = await generateAccessToken(reg);
        const refresh = await userRefreshAccessToken(reg);
        const update = await User.update( { refresh_token: refresh },
            { where: { id: reg.id } })
        if (reg.id > 0) {
            const generateOTP = () => Math.floor(100000 + Math.random() * 900000); 
            const otp = generateOTP();
            const otpExpireTimeFormatted = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

            const updateOtp = await User.update(
              { 
                otp: otp, 
                otp_expaired_at: otpExpireTimeFormatted 
              },
              { where: { id: reg.id } }
            );
            if(updateOtp){
                const transporter = await mailCogfig()
                const emailTemplatePath = path.join(__dirname,"../../../../",'templates', 'register.ejs');
                const emailContent = await ejs.renderFile(emailTemplatePath, {
                    first_name: reg.first_name, 
                });

                const mailOptions = {
                    from: process.env.SMTP_USER,
                    to: reg?.email, 
                    subject: "Welcome to Our Platform!",
                    html: emailContent, 
                };
                await transporter.sendMail(mailOptions);
                const emailTemplatePathOtp = path.join(__dirname,"../../../../",'templates', 'otp.ejs');
                const emailContentOtp = await ejs.renderFile(emailTemplatePathOtp, {
                    first_name: reg.first_name, 
                    otp:otp
                });
                const mailOptionsOtp = {
                    from: process.env.SMTP_USER,
                    to: reg?.email, 
                    subject: "your otp is",
                    html: emailContentOtp, 
                };
                await transporter.sendMail(mailOptionsOtp);
                return res.status(201).json({
                    status: true,
                    user_data:reg,
                    token:token,
                    refresh_token:refresh,
                    message: "Registered successfully",
                    status_code: 201
                })
            }else{
                return res.status(400).json({
                    status: false,
                    user_data:reg,
                    token:token,
                    refresh_token:refresh,
                    message: "send otp failed click resend otp",
                    status_code: 400
                })
            }
        } else {
            return res.status(400).json({
                status: true,
                message: "Unable to register",
                status_code: 400
            })
        }
    } catch (err) {
        console.log("Error in register authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}

exports.login = async (req, res) => {
    try {
        const username = req?.body?.username;
        const password = req?.body?.password;
        // console.log(password);
        const user = await User.findOne({
            attributes: ['id', 'username', 'is_verify','first_name', 'last_name', 'password', 'email', 'phone', 'dob', 'is_active'],
            where: {
                username: username,
            }
        });
        const passwordMatch = await checkPassword(password, user?.password);
        if (!passwordMatch) {
            return res.status(400).json({
                status: false,
                message: 'Invalid credential',
                status_code: 400,
            });
        }
        const token = await generateAccessToken(user);
        const refresh = await userRefreshAccessToken(user);
        await User.update(
            { refresh_token: refresh },
            { where: { id: user.id } }
        );
        return res.status(200).json({
            status: true,
            message: 'User loggedin successfully',
            status_code: 200,
            user_data: user,
            user_token: token,
            refresh_token: refresh
        });
    } catch (err) {
        console.log("Error in login authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}

exports.getNewToken = async (req, res) => {
    try {
        const token = req?.body?.refresh_token;
        const decoded = jwt.decode(token);
        const userId = decoded?.id;
        const userDetails = await User.findOne({
            where: {
                id: userId,
                refresh_token: token,
            },
        });
        if (!userDetails) {
            res.status(403).json({
                status: false,
                status_code: 403,
                message: "Invalid refresh token or user not found",
            })
        }
        const accesstoken = await generateAccessToken(userDetails);
        const refreshtoken = await userRefreshAccessToken(userDetails);
        const user = await User.findByPk(userId);
        const dataUpdate = user.update({ refresh_token: refreshtoken })
        if (dataUpdate) {
            res.status(200).json({
                status: true,
                status_code: 200,
                user_token: accesstoken,
                refresh_token: refreshtoken,
                message: "Access token generated successfully.",
            });
        } else {
            res.status(403).json({
                status: false,
                status_code: 403,
                message: "updation failed",
            })
        }
    } catch (err) {
        console.log("Error in get new token authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }


}


exports.updateDetails = async (req,res) =>{
    try{
        const payload = req?.body
        const user_id = req?.user?.id
        const userUpdate = await User.update(
            {
                full_name: payload?.full_name,
                dob: payload?.dob,
                gender: payload?.gender,
            },
            {
                where: {
                    id: user_id,
                },
            }
        );

        if(userUpdate){
            res.status(200).json({
                status: true,
                status_code: 200,
                message: "details update successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "details updatation failed",
            });
        }

    }catch (err) {
        console.log("Error in get new token authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}

exports.details = async(req,res)=>{
    try{
        const user_id = req?.user?.id
        const details = await User.findByPk(user_id)
        if(details){
            res.status(200).json({
                status: true,
                data:details,
                status_code: 200,
                message: "data found successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "no data found",
            });
        }
    }catch (err) {
        console.log("Error in get new token authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            message:msg,
            status: false,
            status_code: status
        })
    }
}

exports.googlelogin = async (req, res, next) => {
    // try {
        const token = req.body.token;
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`);
        const user_info = googleResponse.data;
        const email = user_info.email || 'N/A';
        const existingUser = await User.findOne({
            where: { username: email }
        });
        const user_details = [];
        if (existingUser) {
            if (existingUser.oauth_provider === 'google') {
                const userValues = existingUser.dataValues;
                let usertoken = await generateAccessToken(existingUser);
                const refresh = await userRefreshAccessToken(existingUser);
                await User.update(
                    { refresh_token: refresh },
                    { where: { id: userValues?.id } }
                );
                res.status(200).json({
                    status: true,
                    status_code: 200,
                    data: existingUser,
                    message: "login successfully",
                    token: usertoken,
                    user_data: existingUser,
                    user_token: usertoken,
                    refresh_token: refresh

                })
            } else if (existingUser.oauth_provider === 'facebook') {
                return res.status(422).json({
                    status: false,
                    message: 'This Email Already Registered With Facebook',
                });
            } else {
                return res.status(422).json({
                    status: false,
                    message: 'This Email Already Registered With Normal Login',
                });
            }
        } else {
            const hashedPwd = await bcrypt.hashSync(`${email}.@123333srk#$hjeerhhhf$%556!2@#$$$%^&^^^nbbfbfbfbfb`,10);
            const newUser = await User.create({
                full_name:user_info?.given_name+' '+user_info?.family_name,
                email: email,
                username: email,
                password: hashedPwd,
                avatar: user_info?.picture,
                first_name: user_info?.given_name,
                last_name: user_info?.family_name,
                role: 2,
                oauth_provider: 'google',
                is_verify: 1,
                is_active: 1
            });
            console.log(newUser?.dataValues?.id,"new")
            if (newUser) {
                const existingUser = await User.findOne({
                    where: { id: newUser.dataValues.id }
                });
                if (existingUser) {
                    const userValues = existingUser.dataValues;
                    let usertoken = await generateAccessToken(existingUser);
                    const refresh = await userRefreshAccessToken(existingUser);
                    await User.update(
                        { refresh_token: refresh },
                        { where: { id: newUser.dataValues.id } }
                    );
                    const priceDetails = await SlotPrice.findOne({
                        where:{
                            free:1
                        }
                    })
                    console.log(priceDetails)
                    if(priceDetails){
                        const createSlot = await UserSlot.create({
                            character_slot:priceDetails?.character_slot_total,
                            group_slot:priceDetails?.group_slot_total,
                            user_id:newUser.dataValues.id
                        })
                    }
                    res.status(200).json({
                        status: true,
                        status_code: 200,
                        data: userValues,
                        message: "login successfully",
                        token: usertoken,
                        user_data: newUser,
                        user_token: usertoken,
                        refresh_token: refresh

                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        message: 'no data',
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'not created',
                });
            }
        }
    // } catch (error) {
    //     console.error("Error:", error);
    //     return res.status(500).json({ error: "Failed to handle payment" });
    // }
}