const {AiCharacter,CharacterDetail} = require("../../../../models");
const {Op} = require('sequelize')

const characterUniqueId = () => {
    const randomNo = Math.floor(Math.random() * 1000000); 
    const timestamp = Date.now(); 
    return `${randomNo}-${timestamp}`; 
};

exports.list = async(req,res)=>{
    try{
        const payload = req?.body;
        const characters = await CharacterDetail.findAll({where:{is_published:1},order:[['created_at','desc']]});
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

exports.createCharacterStep1 = async(req,res)=>{
    try{
        const payload=req?.body;
        const user_id = req?.user?.id;
        const character_id = payload?.character_id;
        // const characterUniqueId = await characterUniqueId();
        if(!character_id){
            const createCharacter = await AiCharacter.create({
                user_id:user_id,
                character_uniqe_id:await characterUniqueId(),
                company_name:payload?.company_name,
                website:payload?.company_website_url,
                product:payload?.product_service,
                ideal_coustomer:payload?.ideal_customer,
                b2b:payload?.is_b2b_b2c,
                is_active:0
            });
            if(createCharacter.id>0){
                res.status(201).json({
                    status:true,
                    message:'Step 1 successfully submitted, proceed to Step 2',
                    character_id:createCharacter.id,
                    status_code:201
                })
            }else{
                res.status(400).json({
                    status:false,
                    message:'Something went wrong',
                    character_id:createCharacter.id,
                    status_code:400
                })
            }
        }else{
            const updateCharacter = await AiCharacter.update({
                company_name:payload?.company_name,
                website:payload?.company_website_url,
                product:payload?.product_service,
                ideal_coustomer:payload?.ideal_customer,
                b2b:payload?.is_b2b_b2c,
            },{
                where:{
                    id:character_id
                }
            });
            if(updateCharacter>0){
                res.status(200).json({
                    status:true,
                    message:'Step 1 successfully submitted, proceed to Step 2',
                    character_id:character_id,
                    status_code:200
                })
            }else{
                res.status(400).json({
                    status:false,
                    message:'Something went wrong',
                    character_id:character_id,
                    status_code:400
                })
            }
        }
    } catch (error) {
        console.error("Error list", error);
        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({ message, status: false, status_code: status });
    }
}

exports.createCharacterStep2 = async(req,res)=>{
    try{
        const payload = req?.body;
        const charId =  payload?.character_id;
        if(charId){
            const updateStep2 = await AiCharacter.update({
                age_start:payload?.age_start,
                age_end:payload?.age_end,
                country:payload?.country,
                job_role:payload?.job_role,
                key_problem:payload?.key_problem,
                buying_product:payload?.buying_product,
                concerns:payload?.concerns
            },{
                where:{
                    id:charId
                }
            });
            if(updateStep2>0){
                return res.status(200).json({
                    status:true,
                    message:'Step 2 successfully submitted, proceed to Step 3',
                    character_id:charId,
                    status_code:200
                })
            }else{
                return res.status(400).json({
                    status:false,
                    message:'Something went wrong',
                    character_id:charId,
                    status_code:400
                })
            }
        }else{
            return res.status(422).json({
                status:false,
                message:'character_id cannot be left blank',
                character_id:charId,
                status_code:422
            })
        }
    } catch (error) {
        console.error("Error list", error);
        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({ message, status: false, status_code: status });
    }
}
exports.createCharacterStep3 = async(req,res)=>{
    try{
        const payload = req?.body;
        let updateObj;
        // if (!req.file) {
        //     updateObj = {
        //         upload_google:payload?.google_link,
        //         avtar_goal:payload?.avatar_goal,
        //         specific_campain:payload?.specific_campaign
        //     }
        // }else{
        //     // const filePath = `uploads/character_documents/${req.user?.id || req.body.userId}/${req.file.filename}`;
        //     updateObj = {
        //         upload_google:payload?.google_link,
        //         avtar_goal:payload?.avatar_goal,
        //         specific_campain:payload?.specific_campaign
        //     }
        //     // console.log()
        // }
        updateObj = {
            upload_google:payload?.google_link,
            avtar_goal:payload?.avatar_goal,
            specific_campain:payload?.specific_campaign
        }
        const updateStep3 = await AiCharacter.update(updateObj,{
            where:{
                id:payload?.character_id
            }
        });
        if(updateStep3>0){
            return res.status(200).json({
                status:true,
                message:'Step 3 successfully submitted, proceed to Step 4',
                character_id:payload?.character_id,
                status_code:200
            })
        }else{
            return res.status(400).json({
                status:false,
                message:'Something went wrong',
                character_id:payload?.character_id,
                status_code:400
            })
        }
    } catch (error) {
        console.error("Error list", error);
        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({ message, status: false, status_code: status });
    }
}

exports.createCharacterStep4 = async(req,res)=>{
    try{
        const payload = req?.body;
        const getCharDetail = await CharacterDetail.findOne({where:{id:payload?.character_detail_id}});
        const updateStep4 = await AiCharacter.update({
            avatar:payload?.avatar_link,
            character_details_name:getCharDetail?.avatar_name,
            character_details_description:getCharDetail?.avatar_description,
            is_active:1
        },{
            where:{
                id:payload?.character_id
            }
        });
        // console.log(updateStep4);
        if(updateStep4>0){
            return res.status(200).json({
                status:true,
                message:'Created Successfully',
                character_id:payload?.character_id,
                status_code:200
            })
        }else{
            return res.status(400).json({
                status:true,
                message:'Something went wrong',
                character_id:payload?.character_id,
                status_code:400
            })
        }
    } catch (error) {
        console.error("Error list", error);
        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({ message, status: false, status_code: status });
    }
}