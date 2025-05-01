const { User,Transaction,Wallet,Plan,Video,AiCharacter,UserSlot } = require("../../../../models")

exports.list = async (req, res) => {
    try {
        const id = req?.body?.id
        const limit = req?.body?.limit || 10;
        const base_url = process?.env?.SERVER_URL;
        const page = req?.body?.page || 1;
        const offset = (page - 1) * limit;
        const query = {
            include:[{
                model:AiCharacter,
                as:"AiCharacter",
                require:false,
            },{
                model:UserSlot,
                as:"UserSlot",
                require:false
            }],
            where: {},
            order: [['created_at', 'desc']],
            limit: limit,
            offset: offset,
        }
        const totalUser = await User.count({
            where: query.where,
            distinct: true
        })
        if(id){
            query.where.id=id
        }
      
        const user = await User.findAll(query)
        const totalPage = Math.ceil(totalUser/limit)
        if (user) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                data: user,
                base_url:base_url,
                data_count: totalUser,
                total_page:totalPage,
                page: page
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: user,
                total_page:totalPage,
                data_count: totalUser,
                page: page
            })
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


exports.status = async (req, res) => {
    try {
        const userid = req?.body?.id
        const userData = await User?.findByPk(userid)


        const update = await userData?.update({
            is_active: !userData?.is_active
        })


        if (update) {
            res.status(200).json({
                messsage: "update successfully",
                status: true,
                status_code: 200,
            })
        } else {
            res.status(400).json({
                messsage: "updation failed",
                status: false,
                status_code: 400,
            })
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

exports.transaction = async(req,res)=>{
    try{
          const userId = req?.body?.id
          const limit = req?.body?.limit || 10;
          const page = req?.body?.page || 1;
          const offset = (page-1) * limit; 
          const query = {
              include:[{
                 model:Plan,
                 as:"Plan",
                 required:false
              }],
              order:[['created_at','desc']],
              where:{},
              limit:limit,
              offset:offset
          }
          query.where.user_id=userId
          const count = await Transaction.count({
            where:query.where,
            distinct: true
          })
          const findTransaction = await Transaction.findAll(query)
          const totalPage = Math.ceil(count/limit)
          if (findTransaction) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                data: findTransaction,
                data_count: count,
                totalPage:totalPage,
                page: page
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: findTransaction,
                data_count: count,
                totalPage:totalPage,
                page: page
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

exports.wallet = async(req,res)=>{
    try{
          const userId = req?.body?.id
          const query = {
              where:{},
          }
          query.where.user_id=userId
          const findWallet = await Wallet.findAll(query)
          if (findWallet) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                data: findWallet,
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: findWallet,
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

exports.walletFreeze = async(req,res)=>{
    try{
        const walletId = req?.body?.id
        const walletData = await Wallet.findByPk(walletId)
        const updateWallet = await walletData.update({
            account_frize:!walletData?.account_frize
        })
        if(updateWallet){
            res.status(200).json({
                messsage: "update successfully",
                status: true,
                status_code: 200,
            })
        }else{
            res.status(400).json({
                messsage: "update failed",
                status: false,
                status_code: 400,
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


exports.credit = async(req,res)=>{
    try{
        const payload = req?.body
        const findTransaction = await Transaction.findOne({
            where:{
                id:payload?.transaction_id,
                user_id:payload?.user_id
            }
        })
        const credit = findTransaction?.total_credit
        const WalletDetails = await Wallet.findOne({
            where:{
                id:payload?.id,
                user_id:payload?.user_id
            }
        })
        const newBalance = WalletDetails?.balance + credit;
        const update = await Wallet?.update({
            balance:newBalance
        },{
            where:{
                id:payload?.id,
                user_id:payload?.user_id
            }
        })
        if(update){
            const update = await Transaction.update({
                transaction_success:"success"
            },{where:{
                id:payload?.transaction_id,
                user_id:payload?.user_id
            }})
            res.status(200).json({
                messsage: "update successfully",
                status: true,
                status_code: 200,
            })
        }else{
            res.status(400).json({
                messsage: "update failed",
                status: false,
                status_code: 400,
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


exports.userVideo = async (req,res) =>{
    try{
        const entity = req?.params?.entity ;
        const limit = parseInt(req?.params?.limit) || 10;
        const page = parseInt(req?.params?.page) || 1;
        const userId = req?.params?.user_id
        const baseAiUrl = process?.env?.SERVER_URL
        const offset = (page-1)*limit
        const query = {
            where:{},
            limit:limit,
            offset:offset,
            order:[['created_at','desc']]
        }
        if(entity){
            query.where.type = entity
        }
        query.where.user_id = userId
        const count = await Character.count({
            where:query.where,
            distint:true
        })
        const totalPage = Math.ceil(count/limit)
        const allVideo  = await Character.findAll(query)
        if(allVideo){
            res.status(200).json({
                baseUrl:baseAiUrl,
                messsage: "data found",
                status: true,
                status_code: 200,
                total_page:totalPage,
                data: allVideo,
                data_count: count,
                page: page
            })
        }else{
            res.status(200).json({
                baseUrl:baseAiUrl,
                messsage: "data found",
                status: true,
                status_code: 200,
                total_page:totalPage,
                data: allVideo,
                data_count: count,
                page: page
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

exports.videoStatus = async(req,res)=>{
    try{
        const VideoDetails =await  Character.findByPk(req?.body?.id)
        if(VideoDetails){
               const update =await  VideoDetails.update({
                   is_active:!VideoDetails?.is_active
               })
               if(update){
                    res.status(200).json({
                        messsage: "updated",
                        status: true,
                        status_code: 200,
                    })
               }else{
                res.status(400).json({
                    messsage: "updation failed",
                    status: false,
                    status_code: 400,
                })
               }
        }else{
            res.status(422).json({
                messsage: "no video data found",
                status: false,
                status_code: 422,
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


exports.videoFeature = async(req,res)=>{
    try{
        const VideoDetails = await Character.findByPk(req?.body?.id)
        if(VideoDetails){
               const update = await VideoDetails.update({
                   is_publish:!VideoDetails?.is_publish
               })
               if(update){
                    res.status(200).json({
                        messsage: "updated",
                        status: true,
                        status_code: 200,
                    })
               }else{
                res.status(400).json({
                    messsage: "updation failed",
                    status: false,
                    status_code: 400,
                })
               }
        }else{
            res.status(422).json({
                messsage: "no video data found",
                status: false,
                status_code: 422,
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


exports.public = async(req,res) =>{
    try{
         const character_id = req?.body?.char_id
         if(!character_id){
                res.status(422).json({
                    message:"character_id is require",
                    status_code:422,
                    status:false
                })
         }
         const characterData = await Character.findByPk(character_id) 
         if(characterData?.public == 1){
            const update = await Character.update({
                is_publish:!characterData?.is_publish
             },{
                where:{
                    id:character_id
                }
             })
             if(update){
                res.status(200).json({
                    message:"updated",
                    status_code:200,
                    status:true
                })
             }else{
                res.status(400).json({
                    message:"updation false",
                    status_code:400,
                    status:false
                })
             }
         }else{
            res.status(422).json({
                message:"character is not public",
                status_code:422,
                status:false
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