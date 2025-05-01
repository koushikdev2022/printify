const checkPassword = require("../../../../helper/checkPassword");
const { generateAccessToken, userRefreshAccessToken, adminRefreshAccessToken, generateAdminAccessToken } = require("../../../../helper/generateAccessToken");
const { User }=require("../../../../models");


exports.login = async(req,res) =>{
    try {
        const username = req?.body?.username;
        const password = req?.body?.password;
        const user = await User.findOne({
            where: {
                username: username,
                role:1,
            }
        });
        if(user){
            const passwordMatch = await checkPassword(password, user?.password);
            if (!passwordMatch) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid credential',
                    status_code: 400,
                });
            }
            const token = await generateAdminAccessToken(user);
            const refresh = await adminRefreshAccessToken(user);
            await User.update(
                { refresh_token: refresh },
                { where: { id: user.id } }
            );
            return res.status(200).json({
                status: true,
                message: 'User loggedin successfully',
                status_code: 200,
                user_token: token,
                refresh_token: refresh
            });
        }else{
            return res.status(400).json({
                status: false,
                message: 'invalid username',
                status_code: 400,
            });
        }
       
    } catch (err) {
        console.log("Error in login authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status
        })
    }
}