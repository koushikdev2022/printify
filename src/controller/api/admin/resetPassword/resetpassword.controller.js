const { User } = require("../../../../models")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.reset = async(req,res)=>{
       try{
         const convertPassword =  await bcrypt.hashSync(req?.body?.password, 10);
         const updatePassword =  await User.update({
            password:convertPassword
         },{
            where:{
                id:req?.user?.id
            }
         })
         if(updatePassword){
                res.status(200).json({
                    message:"password updated",
                    status:true,
                    status_code:200
                })
         }else{
            res.status(400).json({
                message:"password updation Failed",
                status:false,
                status_code:400
            })
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