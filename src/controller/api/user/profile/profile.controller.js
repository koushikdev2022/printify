
const {User,UserAddress} = require("../../../../models")


exports.update = async (req,res) =>{
    try{
        const payload = req?.body
        const userId = req?.user?.id
        const profileUpdate = await User.update({
            full_name:payload?.full_name,
            first_name:payload?.first_name,
            last_name:payload?.last_name,
            email :payload?.email ,
            phone :payload?.phone ,
            dob:payload?.dob
        },{
            where:{
                id:userId
            }
        })
        if(profileUpdate){
            res.status(200).json({
                message:"update successfully",
                status:true,
                status_code:200
            })
        }else{
            res.status(400).json({
                message:"update successfully",
                status:false,
                status_code:400
            })
        }
    }catch (err) {
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
exports.profile = async(req,res)=>{
    try{
        const userId = req?.user?.id
        const baseUrl = process.env.SERVER_URL
        const userDetails = await User.findOne({
            include:[{
                model:UserAddress,
                as:"UserAddress",
                require:false
            }],
            where:{
                id:userId
            }
        })
        if(userDetails){
            res.status(200).json({
                base:baseUrl,
                message:"update successfully",
                status:true,
                userDetails:userDetails,
                status_code:200
            })
        }else{
            res.status(200).json({
                base:baseUrl,
                message:"update successfully",
                status:true,
                userDetails:userDetails,
                status_code:200
            })
        }
    }catch (err) {
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
exports.avatar = async(req,res)=>{
    try{
        const id = req?.user?.id
        const file = req?.file
        const path = req?.file?.path
        const type = req?.body?.type
        const array = path.split('public')
        const directory = array[array.length - 1];
        const normalizedPath = directory.replace(/\\/g, '/');
        const update = await User?.update({
            avatar:normalizedPath,
            type:type
        },{
            where:{
                id:id
            }
        })
        if(update){
            res.status(200).json({
                status: true,
                status_code: 200,
                message: "update successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "update failed",
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