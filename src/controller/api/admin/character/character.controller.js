const {CharacterDetail,AiCharacter} = require("../../../../models");

exports.createCharacter = async(req,res)=>{
    try{
        const payload = req?.body;
        if (!req.file) {
            return res.status(422).json({
                status:false,
                message:"Please upload the file",
                status_code:422
            })
        }else{
            const filePath = `uploads/character_details/${req.file.filename}`;
            const createCharacter = await CharacterDetail.create({
                avatar_name:payload?.avatar_name,
                avatar:filePath,
                avatar_description:payload?.avatar_description,
                is_active:1,
                is_published:0
            });
            if(createCharacter.id>0){
                return res.status(201).json({
                    status:true,
                    message:"Created Successfully",
                    status_code:201
                })
            }else{
                return res.status(400).json({
                    status:false,
                    message:"Unable to create",
                    status_code:400
                })
            }
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
        const payload = req?.body;
        const characters = await CharacterDetail.findAll({order:[['created_at','desc']]});
        const character_arr = characters.map(character=>{
            return {
                id:character.id,
                name:character.avatar_name,
                avatar:`${payload?.base_url}${character.avatar}`
            }
        })
        return res.status(200).json({
            status:true,
            res:character_arr,
            status_code:200
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

exports.publishCharacter = async(req,res)=>{
    try{
        const payload = req?.body;
        if(!payload?.character_id){
            return res.status(422).json({
                status:false,
                message:'character_id cannot be left blank',
                status_code:422
            })
        }
        const updateChar = await AiCharacter.update({is_published:1},{
            where:{id:payload?.character_id}
        });
        if(updateChar>0){
            return res.status(200).json({
                status:true,
                message:'Published Successfully',
                status_code:200
            })
        }else{
            return res.status(400).json({
                status:false,
                message:'Unable to publish',
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

exports.publishCharacterDetail = async(req,res) =>{
    try{
        const payload = req?.body;
        if(!payload?.character_detail_id){
            return res.status(422).json({
                status:false,
                message:'character_detail_id cannot be left blank',
                status_code:422
            })
        }
        const updateCharDetail = await CharacterDetail.update({is_published:1},{where:{id:payload?.character_detail_id}});
        if(updateCharDetail>0){
            return res.status(200).json({
                status:true,
                message:'Published successfully',
                status_code:200
            })
        }else{
            return res.status(400).json({
                status:true,
                message:'Unable to update',
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