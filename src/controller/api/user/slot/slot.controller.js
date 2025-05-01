const {SlotPrice,UserSlot,Wallet,Transaction,Character,Group} = require("../../../../models")


exports.list = async (req,res)=>{
    try{
        const totalPricing = await SlotPrice.findAll({
            where:{
                is_active:1,
                is_deleted:0,
                free:0
            }
        }) 
        res.status(200).json({
            message:"data found",
            status:true,
            status_code:200,
            data:totalPricing
        })
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


exports.buySlot = async (req,res)=>{
    try{ 
        const user_id = req?.user?.id
        const payload = req?.body
        const findWallet = await Wallet.findOne({
            where:{
                user_id:user_id,
                account_frize:0
            }
        })
        if(findWallet){
            const priceDetails = await SlotPrice.findOne({
                where:{
                    id:req?.body?.id
                }
            })
            if(findWallet?.balance > priceDetails?.price){
                const Slot = await UserSlot.findOne({
                    user_id:user_id
                })
                if(Slot){
                    const total_character_slot_total = priceDetails?.character_slot_total+Slot?.character_slot
                    const total_group_slot_total = priceDetails?.group_slot_total+Slot?.group_slot
                    const update =  await UserSlot.update({
                        character_slot:total_character_slot_total,
                        group_slot:total_group_slot_total,
                    },{where:{
                        user_id:user_id
                    }})
                    if(total_character_slot_total){
                        const remainBalance = findWallet?.balance-priceDetails?.price
                        const updateWallet = await Wallet.update({
                            balance:remainBalance
                        },{
                            where:{
                                user_id:user_id
                            }
                        })
                        const createTransaction = await Transaction.create({
                                user_id:user_id,
                                plan_id:0,
                                address_id: 0,
                                total_balance:0,
                                total_credit: priceDetails?.price,
                                payment_intend:"NULL",
                                transaction_type:"debit",
                                transaction_success:"success"

                        })
                        res.status(200).json({
                            status:true,
                            status_code:200,
                            message:"slot updated"
                        })
                    }else{
                        res.status(400).json({
                            status:false,
                            status_code:400,
                            message:"slot updation false"
                        })
                    }
                }else{
                    const createSlot = await UserSlot.create({
                        character_slot:priceDetails?.character_slot_total,
                        group_slot:priceDetails?.group_slot_total,
                        user_id:user_id
                    })
                    if(createSlot.id>1){
                        const remainBalance = findWallet?.balance-priceDetails?.price
                        const updateWallet = await Wallet.update({
                            balance:remainBalance
                        },{
                            where:{
                                user_id:user_id
                            }
                        })
                        const createTransaction = await Transaction.create({
                                user_id:user_id,
                                plan_id:0,
                                address_id: 0,
                                total_balance:0,
                                total_credit: priceDetails?.price,
                                payment_intend:"NULL",
                                transaction_type:"debit",
                                transaction_success:"success"

                        })
                        res.status(200).json({
                            status:true,
                            status_code:200,
                            message:"slot updated"
                        })
                    }else{
                        res.status(400).json({
                            status:false,
                            status_code:400,
                            message:"slot updation false"
                        })
                    }
                }
            }else{
                res.status(402).json({
                    status:false,
                    status_code:402,
                    message:"payment required"
                })
            }
        }else{
            res.status(422).json({
                status:false,
                status_code:422,
                message:"yout wallet is not created or freezed"
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

exports.userSlot = async (req,res)=>{
    try{
        const userSlot = await UserSlot.findOne({
            where:{
                user_id:req?.user?.id
            }
        })
        if(userSlot){
            res.status(200).json({
                status:true,
                status_code:200,
                data:userSlot,
                message:"data found"
            })
        }else{
            res.status(400).json({
                status:false,
                status_code:400,
                data:userSlot,
                message:"no data found"
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


exports.character = async (req,res)=>{
    try{
        const totalCountCharacter = await Character.findAll({where:{user_id:req?.user?.id,is_deleted:0,is_completed:1,is_active:1}})
        const count =  totalCountCharacter.length
        res.status(200).json({
            status:true,
            status_code:200,
            count:count,
            message:"data found"
        })
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


exports.group = async (req,res)=>{
    try{
        const totalCountCharacter = await Group.findAll({where:{user_id:req?.user?.id,is_deleted:0}})
        const count =  totalCountCharacter.length
        res.status(200).json({
            status:true,
            status_code:200,
            count:count,
            message:"data found"
        })
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