const { UserAddress } = require("../../../../models")


exports.create = async(req,res)=>{
    try{
        const payload = req?.body
        const userId = req?.user?.id
        const createAddress = await UserAddress.create({
            user_id:userId,
            address_line1:payload?.address_line1,
            address_line2:payload?.address_line2,
            city:payload?.city,
            state:payload?.state,
            postal_code:payload?.state,
            country:payload?.country,
        })
        if(createAddress.id >0){
            return res.status(201).json({
                status: true,
                id:createAddress.id,
                message: "address successfully",
                status_code: 201
            })
        }else{
            return res.status(400).json({
                status: false,
                message: "failed",
                status_code: 400
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


exports.list = async(req,res)=>{
    try{
        const userId = req?.user?.id
        const userDetails = await UserAddress?.findAll({
            where:{
                user_id:userId
            }
        })
        if(userDetails){
            return res.status(200).json({
                status: true,
                message: "address found successfully",
                data:userDetails,
                status_code: 200
            })
        }else{
            return res.status(200).json({
                status: true,
                message: "no data found",
                data:userDetails,
                status_code: 200
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


exports.changePrimary = async(req,res)=>{
    
}