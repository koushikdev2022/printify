
const {User,AiCharacter,CopyCharacterUser,Image,Subscription,Plan,Chat,Voice,CharacterVoiceMap,GroupAiMessage,Tag,GroupMap,CharacterTagMap,Group} = require("../../../../models");
const groupAiMessage = require("../../../../models/groupAiMessage");
const {Op} = require('sequelize')

const fal = require("@fal-ai/client");
const  exec = require("child_process");
const path = require("path");

const { fork } = require("child_process");


const generateData = () => {
    const randomNo = Math.floor(Math.random() * 1000000); 
    const timestamp = Date.now(); 
    return `${randomNo}-${timestamp}`; 
};

exports.add = async(req,res) =>{
    try{
        const payload = req?.body
        const user_id = req?.user?.id
        const userCreate = await Character.create({
            character_name:payload?.character_name,
            gender:payload?.gender,
            user_id:user_id
        })
        if(userCreate){
            const generData = await generateData()
            const update = await  Character.update({
                character_uniqe_id:generData
            },{
                where:{
                    id:userCreate?.id
                }
            })
            if(update){
                res.status(201).json({
                    status: true,
                    data:userCreate,
                    status_code: 201,
                    message: "first step successfully",
                });
            }else{
                res.status(400).json({
                    status: false,
                    status_code: 400,
                    message: "update failed",
                });
            }
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "create failed",
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


exports.secondAddcreate = async (req,res)=>{
    try{
        const id = req?.user?.id
        const type = req?.body?.type
        const update = await Character?.create({
            avatar:req?.body?.image,
            type:type,
            character_name:" ",
            video_url:req?.body?.video_url,
            user_id:id,
            gender:" "
        })
        if(update.id > 0 ){
            res.status(201).json({
                status: true,
                id:update.id,
                status_code: 201,
                message: "created successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "creation  failed",
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

exports.secondAdd = async(req,res) =>{
    try{
        const id = req?.body?.id
        const type = req?.body?.type
        const update = await Character?.update({
            avatar:req?.body?.avatar,
            video_url:req?.body?.video_url,
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
exports.editFirst = async(req,res)=>{
    try{
        const payload = req?.body
        const user_id = req?.user?.id
        const id = req?.body?.id
        const generData = await generateData()
        const userUpdate = await Character.update({
            character_uniqe_id:generData,
            character_name:payload?.character_name,
            gender:payload?.gender,
            
        },{where:{
            id:id
        }})
        if(userUpdate){
            res.status(200).json({
                status: true,
                status_code: 200,
                message: "sucessfully updated",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "create failed",
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


// exports.image = async(req,res) =>{
//     try{
//         const id = req?.body?.id
//         const file = req?.file
//         const path = req?.file?.path
//         const type = req?.body?.type
//         const array = path.split('public')
//         const directory = array[array.length - 1];
//         const normalizedPath = directory.replace(/\\/g, '/');
//         const update = await Character?.update({
//             avatar:normalizedPath,
//             type:type
//         },{
//             where:{
//                 id:id
//             }
//         })
//         if(update){
//             res.status(200).json({
//                 status: true,
//                 status_code: 200,
//                 message: "update successfully",
//             });
//         }else{
//             res.status(400).json({
//                 status: false,
//                 status_code: 400,
//                 message: "update failed",
//             });
//         }

        

//     }catch (err) {
//         console.log("Error in get new token authController: ", err);
//         const status = err?.status || 400;
//         const msg = err?.message || "Internal Server Error";
//         return res.status(status).json({
//             message:msg,
//             status: false,
//             status_code: status
//         })
//     }
// }
exports.image = async (req, res) => {
    try {
      const id = req?.body?.id;
      const file = req?.file;
      const imagePath = req?.file?.path;
      const type = req?.body?.type;
  
      if (!file) {
        return res.status(400).json({
          status: false,
          status_code: 400,
          message: "No image uploaded",
        });
      }
  
      // Normalize path
      const array = imagePath.split("public");
      const directory = array[array.length - 1];
      const normalizedPath = directory.replace(/\\/g, "/");
  
      // Update character avatar in DB
      const update = await Character.update(
        { avatar: normalizedPath, type: type },
        { where: { id: id } }
      );
  
      if (!update) {
        return res.status(400).json({
          status: false,
          status_code: 400,
          message: "Update failed",
        });
      }
  
      
      res.status(200).json({
        status: true,
        status_code: 200,
        message: "Image uploaded successfully, video processing started",
      });
  
    
      const imageUrl = `${req.protocol}://${req.get("host")}${normalizedPath}`;
      const child = fork(path.join(__dirname, "falProcess.js"));
  
      
      child.send({ imageUrl,id});
  
    } catch (err) {
      console.log("Error in image processing: ", err);
      return res.status(err?.status || 400).json({
        message: err?.message || "Internal Server Error",
        status: false,
        status_code: err?.status || 400,
      });
    }
  };

  
  
 
  exports.imagecreate = async (req, res) => {
    try {
      const usrid = req?.user?.id;
      const file = req?.file;
      const imagePath = req?.file?.path;
      const type = req?.body?.type;
  
      if (!file) {
        return res.status(400).json({
          status: false,
          status_code: 400,
          message: "No image uploaded",
        });
      }
  
      // Normalize path
      const array = imagePath.split("public");
      const directory = array[array.length - 1];
      const normalizedPath = directory.replace(/\\/g, "/");
  
      // Create new character entry
      const update = await Character.create({
        avatar: normalizedPath,
        type: type,
        character_name: " ",
        user_id: usrid,
        gender: " ",
      });
  
      if (!update || update.id < 1) {
        return res.status(400).json({
          status: false,
          status_code: 400,
          message: "Creation failed",
        });
      }
  
      const id = update.id;
      const imageUrl = `${req.protocol}://${req.get("host")}${normalizedPath}`;
  
      
      const child = fork(path.join(__dirname, "falProcess.js"));
      child.send({ imageUrl, id });
  
     
      res.status(201).json({
        status: true,
        id: update.id,
        status_code: 201,
        message: "Created successfully, video processing started",
      });
  
    } catch (err) {
      console.log("Error in image creation:", err);
      return res.status(err?.status || 500).json({
        message: err?.message || "Internal Server Error",
        status: false,
        status_code: err?.status || 500,
      });
    }
  };

exports.story = async(req,res) =>{
    try{
        const id = req?.body?.id
        const background = req?.body?.background
        const greeting = req?.body?.greeting
        const response_derective = req?.body?.response_derective
        const key_memory = req?.body?.key_memory
        const example_message = req?.body?.example_message
        const update = await Character?.update({
            background_story:background,
            character_greeting:greeting,
            response_derective:response_derective,
            key_memory:key_memory,
            example_message:example_message,
            is_completed:1
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


exports.explore = async(req,res) =>{
    try{
        const base_url = process?.env?.SERVER_URL
        const userid = req?.user?.id
        const type = req?.body?.type
        const gender = req?.body?.gender
        const keyword = req?.body?.keyword
        const char_id = req?.body?.char_id
        const limit = req?.body?.limit || 10
        const page =  req?.body?.page || 1
        const query = {
            include:[{
                model:Voice,
                as:"Voice",
                require:false
            },{
                model:Tag,
                as:"Tag",
                require:false
            }],
            where:{},
        }
        query.where.is_publish = 1
        query.where.is_active = 1
        query.where.is_completed = 1
        query.where.is_deleted = 0
        
        query.where.user_id= { [Op.ne]: userid } 
        const copiedIds = [];
        const userChar = await Character.findAll({
            where:{
                user_id:userid,
                parent_id:{
                    [Op.ne]:0
                }
            }
        })
        for(let userCh of userChar){
            copiedIds.push(userCh?.parent_id)
        }
        if(type){
            query.where.type = type
        }
        if(gender){
            query.where.gender = gender
        }
        if(char_id){
            query.where.id = char_id
        }
        query.where.id= { [Op.notIn]: copiedIds }
        if (keyword) {
            const total_tags_match = await Tag.findAll({
                where: {
                    tags: { 
                        [Op.like]: `%${keyword}%`
                    }
                }
            });
            const ids = []
            for(let tags of total_tags_match){
                ids.push(tags?.id)
            }
            const charId = []
            const total_tcharacter_match = await CharacterTagMap.findAll({
                where: {
                    tags_id: { 
                        [Op.in]: ids
                    }
                }
            });
            for(let char of total_tcharacter_match){
                charId.push(char?.character_id)
            }
            
            query.where[Op.or] = [
                { character_name: { [Op.like]: `%${keyword}%` } }, 
                { gender: { [Op.like]: `%${keyword}%` } } ,
                { background_story: { [Op.like]: `%${keyword}%` } } ,
                { character_greeting: { [Op.like]: `%${keyword}%` } } ,
                { response_derective: { [Op.like]: `%${keyword}%` } } ,
                { key_memory: { [Op.like]: `%${keyword}%` } } ,
                {id:{[Op.in]:charId}}
            ];
        }
        const characterCount = await Character.count({
            where: query.where,
            distinct: true,
          })
        const offset = (page -1 ) * limit
        query.limit=limit,
        query.offset=offset
        const totalPage = Math.ceil(characterCount/limit)
        const character = await Character.findAll(query)

        if(character){
            res.status(200).json({
                status: true,
                base_url:base_url,
                data:character,
                total_data:characterCount,
                totalPage:totalPage,
                status_code: 200,
                message: "update successfully",
            });
        }else{
            res.status(200).json({
                status: false,
                status_code: 200,
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
exports.list = async(req,res) =>{
    try{
        const id = req?.user?.id
        const base_url = process?.env?.SERVER_URL
        const type = req?.body?.type
        const gender = req?.body?.gender
        const char_id = req?.body?.char_id
        const limit = req?.body?.limit || 10
        const page =  req?.body?.page || 1
        const query = {
            include:[{
                model:Voice,
                as:"Voice",
                require:false
            },{
                model:Tag,
                as:"Tag",
                require:false
            }],
            where:{},
        }
        query.where.user_id = id
        query.where.is_active = 1
        query.where.is_published = 1
        query.where.is_deleted = 0
        if(type){
            query.where.type = type
        }
        if(gender){
            query.where.gender = gender
        }
        if(char_id){
            query.where.id = char_id
        }
        const characterCount = await AiCharacter.count({
            where: query.where,
            distinct: true,
          })
        const offset = (page -1 ) * limit
        query.limit=limit,
        query.offset=offset
        const character = await AiCharacter.findAll(query)

        if(character){
            res.status(200).json({
                status: true,
                base_url:base_url,
                data:character,
                total_data:characterCount,
                status_code: 200,
                message: "update successfully",
            });
        }else{
            res.status(200).json({
                status: false,
                status_code: 200,
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

exports.delete = async (req,res) =>{
        try{

            const user_id = req?.user?.id
            const id = req?.body?.id

            const update = await Character?.update({
                is_deleted:1
            },{
                where:{
                    id:id,
                    user_id:user_id
                }
            })
            if(update){
                res.status(200).json({
                    status: true,
                    status_code: 200,
                    message: "delete successfully",
                });
            }else{
                res.status(400).json({
                    status: false,
                    status_code: 400,
                    message: "delete  failed",
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


exports.data = async(req,res)=>{
    try{
        const id = req?.user?.id
        const code = req?.body?.code
        const findData =  await Character.findOne({
            where:{
                character_uniqe_id:code,
                is_deleted:0
            }
        })
        if(findData){
            const generData = await generateData()
            const createData = await Character.create({
                user_id:id,
                character_uniqe_id:generData,
                character_name:findData?.character_name,
                dob:findData?.dob,
                gender:findData?.gender,
                avatar:findData?.avatar,
                background_story:findData?.background_story,
                character_greeting:findData?.character_greeting,
                is_completed:1,
                is_active:1,
                response_derective:findData?.response_derective,
                key_memory:findData?.key_memory,
                example_message:findData?.example_message,
                public:findData?.public,
                is_publish:findData?.is_publish,
                type:findData?.type,
                video_url:findData?.video_url,
                parent_id:findData?.id
            })
             if(createData.id>0){
                const copy = await CopyCharacterUser.create({
                    character_id:findData?.id,
                    user_id:id,
                    is_active:0
                })
                if(copy.id){
                    res.status(200).json({
                        status: true,
                        status_code: 200,
                        message: "copied successfully",
                    });
                }else{
                    res.status(200).json({
                        status: true,
                        status_code: 200,
                        message: "copied successfully but not mapped",
                    });
                }
              
             }else{
                res.status(400).json({
                    status: false,
                    status_code: 400,
                    message: "failed to copy",
                });
             }
        }else{
            res.status(422).json({
                status: false,
                status_code: 422,
                message: "invalid code",
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
exports.dataList = async(req,res)=>{
    try{
        const id = req?.user?.id
        const code = req?.body?.code
        const findData =  await Character.findOne({
            where:{
                character_uniqe_id:code,
                is_deleted:0
            }
        })
        if(findData){
            res.status(200).json({
                status: true,
                base_url:process.env.SERVER_URL,
                data:findData,
                status_code: 200,
                message: "data found",
            });
            
        }else{
            res.status(200).json({
                status: true,
                data:findData,
                status_code: 200,
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


exports.imagedata = async (req,res) =>{
    try{
        const base_url = process?.env?.SERVER_URL
        const type = req?.body?.type || 1
        const image = await Image.findAll({
            where:{
                is_deleted:0,
                is_active:1,
                type:type
            }
         })
         if(image){
            res.status(200).json({
                status: true,
                base_url:base_url,
                data:image,
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


exports.editList = async (req,res)=>{
    try{
        try{
            const id = req?.user?.id
            const base_url = process?.env?.SERVER_URL
            console.log(base_url)
            const char_id = req?.body?.char_id
            const limit = req?.body?.limit || 10
            const page =  req?.body?.page || 1
            const query = {
                where:{},
            }
            query.where.user_id = id
            query.where.is_active = 1
            query.where.is_deleted = 0
            if(char_id){
                query.where.id = char_id
            }
            const characterCount = await Character.count({
                where: query.where,
                distinct: true,
              })
            const offset = (page -1 ) * limit
            query.limit=limit,
            query.offset=offset
            const character = await Character.findAll(query)
    
            if(character){
                res.status(200).json({
                    status: true,
                    base_url:base_url,
                    data:character,
                    total_data:characterCount,
                    status_code: 200,
                    message: "update successfully",
                });
            }else{
                res.status(200).json({
                    status: false,
                    status_code: 200,
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


exports.totalCharacter = async (req,res)=>{
    try{
        try{
            const id = req?.user?.id
            const totalCharacter = await Character.findAll({
                    where:{user_id:id,is_deleted:0}
            }) 
            const count = totalCharacter.length
            const page = 1
            const limit = 1
            const offset = (page -1)*limit
            const subscription = await Subscription.findAll({
                include:[{
                    model:Plan,
                    as:"Plan",
                    require:false
                }],
                order:[['created_at','desc']],
                limit:limit,
                offset:offset
            })
            res.status(200).json({
                message:"data found",
                status:true,
                status_code:200,
                count_character:count,
                subscription:subscription
            })
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


exports.chatList = async (req,res) =>{
    try{
        const userId = req?.user?.id;
        const character_id = req?.body?.character_id
        const chatList = await Chat.findAll({
            where:{
                user_id:userId,
                character_id:character_id
            }
        })
        if(chatList){
               res.status(200).json({
                    status:true,
                    message:"data found",
                    chatList:chatList,
                    status_code:200
               })
        }else{
            res.status(200).json({
                status:true,
                message:"no data found",
                chatList:chatList,
                status_code:200
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

exports.voice = async(req,res)=>{
    try{
        const userId = req?.user?.id;
        const gender = req?.body?.gender;
        const server_url = process?.env?.SERVER_URL
        const voice = await Voice?.findAll({
            where:{
                gender:gender
            }
        })
        if(voice){
            res.status(200).json({
                status:true,
                server_url:server_url,
                message:"data found",
                voice:voice,
                status_code:200
           })
        }else{
            res.status(200).json({
                status:true,
                message:"data found",
                voice:voice,
                server_url:server_url,
                status_code:200
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

exports.lastChat = async (req,res) =>{
    try{
        const userId = req?.user?.id
        const base_url = process?.env?.SERVER_URL
        const lastChat = await Chat.findOne({
            include:[{
                model:Character,
                as:"Character",
                require:true
            }],
            where:{
                user_id:userId
            },
            order:[['id','desc']]
        })
        if(lastChat){
            res.status(200).json({
                base_url:base_url,
                status:true,
                message:"data found",
                lastChat:lastChat,
                status_code:200
           })
        }else{
            res.status(200).json({
                base_url:base_url,
                status:true,
                message:"data found",
                lastChat:lastChat,
                status_code:200
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

exports.preferedVoice = async (req,res) =>{
    try{
            const voice_id = req?.body?.voice_id
            const character_id = req?.body?.character_id
            const server_url = process?.env?.SERVER_URL
            const mapFind = await CharacterVoiceMap.findOne({
                where:{
                    character_id:character_id
                }
            })
            if(mapFind){
                const update = await CharacterVoiceMap?.update({
                    voice_id:voice_id
                },{
                    where:{
                        character_id:character_id
                    }
                })
                if(update){
                    res.status(200).json({
                        status:true,
                        message:"mapped",
                        status_code:200
                   })
                }else{
                    res.status(400).json({
                        status:false,
                        message:"mapped failed",
                        status_code:400
                   })
                }
            }else{
                const create = await CharacterVoiceMap?.create({
                    voice_id:voice_id,
                    character_id:character_id,
                    gender:"abcd"
                  
                })
                if(create.id>0){
                    res.status(200).json({
                        status:true,
                        message:"mapped",
                        status_code:200
                   })
                }else{
                    res.status(400).json({
                        status:false,
                        message:"mapped failed",
                        status_code:400
                   })
                }
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

exports.tags = async(req,res)=>{
    try{
         const tag = await Tag.findAll({
            where:{
                is_active:1
            }
         })
         if(tag){
            res.status(200).json({
                status:true,
                message:"found",
                data:tag,
                status_code:200
           })
        }else{
            res.status(200).json({
                status:true,
                message:"found",
                data:tag,
                status_code:200
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


exports.map = async (req,res)=>{
    try{
        const character_id = req?.body?.character_id;
        console.log(character_id)
        const tags = req?.body?.tags
        for(let tg of tags){
            console.log(tg)
            await CharacterTagMap.create({
                tags_id:tg,
                character_id:character_id
            })
        }
        res.status(201).json({
            status:true,
            message:"mapped",
            status_code:201
        })
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


exports.public = async(req,res) =>{
    try{
         const character_id = req?.body?.character_id
         if(!character_id){
                res.status(422).json({
                    message:"character_id is require",
                    status_code:422,
                    status:false
                })
         }
         const characterData = await Character.findByPk(character_id) 
         const update = await Character.update({
            public:!characterData?.public
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


exports.groupChat = async(req,res)=>{
    try{
        const id = req?.body?.id;
         const data = await Group.findAll({
            include:[{
                model:User,
                as:"User",
                require:false
            },{
                model:GroupAiMessage,
                as:"GroupAiMessage",
                require:false
            }]
         })
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
exports.groupCreate = async(req,res)=>{
    try{
        const groupname = req?.body?.group_name;
        const user_id= req?.user?.id
        const createGroup = await Group.create({
            group_name:req?.body?.group_name,
            user_id:user_id
        })
        if(createGroup.id>0){
            res.status(201).json({
                status:true,
                message:"created",
                group_id:createGroup.id,
                status_code:201
            })
        }else{
            res.status(400).json({
                status:false,
                message:"failed",
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
exports.groupMap = async (req,res) =>{
    try{
        const group_id = req?.body?.group_id
        const character_id = req?.body?.char_id
        for(let char of character_id){
           await GroupMap.create({
                character_id:char,
                group_id:group_id
            })
        }
        res.status(201).json({
            status:true,
            message:"created",
            status_code:201
        })
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


exports.remove = async(req,res)=>{
    try{
        const map_id = req?.body?.map_id
        if(!map_id){
            res.status(422).json({
                message:"map_id is require",
                status_code:422,
                status:false
            })
        }
        const find = await GroupMap.findByPk(map_id)
        if(!find){
            res.status(422).json({
                message:"invalid map_id",
                status_code:422,
                status:false
            })
        }
        const destry = await find.destroy()
        if(destry){
            res.status(200).json({
                status:true,
                message:"destroy",
                status_code:200
            })
        }else{
            res.status(400).json({
                status:false,
                message:"failed",
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

exports.groupList = async(req,res)=>{
    try{
        const id = req?.user?.id
        const base_url = process?.env?.SERVER_URL
        const type = req?.body?.type
        const gender = req?.body?.gender
        const group_id = req?.body?.group_id
        const limit = req?.body?.limit || 10
        const page =  req?.body?.page || 1
        const query = {
            include:[{
                model:Character,
                as:"Character",
                require:false,
                where:{is_deleted:0}
            },{
                model:GroupAiMessage,
                as:"GroupAiMessage",
                require:false,
                include:[{
                    model:Character,
                    as:"Character",
                    require:false,
                }]
            }],
            where:{},
        }
        query.where.user_id = id
        query.where.is_active = 1
        query.where.is_deleted = 0
        if(group_id){
            query.where.id = group_id
        }
        const characterCount = await Group.count({
            where: query.where,
            distinct: true,
          })
        const offset = (page -1 ) * limit
        query.limit=limit,
        query.offset=offset
        const character = await Group.findAll(query)

        if(character){
            res.status(200).json({
                status: true,
                base_url:base_url,
                data:character,
                total_data:characterCount,
                status_code: 200,
                message: "update successfully",
            });
        }else{
            res.status(200).json({
                status: false,
                status_code: 200,
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

exports.groupCharacter = async (req,res) =>{
    try{
         const base_url = process?.env?.SERVER_URL
      
         const text = req?.body?.name;
         const groupQuery = {
            where: {
                id: req?.body?.id
            },
            include: [{
                model: Character,
                as: "Character",
                required: false,
                where: text ? { character_name: { [Op.like]: `%${text}%` } ,is_deleted:0} : { character_name: { [Op.like]: `%${text}%` },is_deleted:0 }
            }]
        };

        const character = await Group.findOne(groupQuery);
         res.status(200).json({
            status: true,
            status_code: 200,
            character:character,
            base_url:base_url,
            message: "update successfully",
        });
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


exports.search = async (req,res) =>{
    try{

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

exports.group = async (req,res)=>{
    try{
        const id = req?.body?.id
        const group = await Group.findOne({
            include:[{
                model:Character,
                as:"Character",
                require:false
            },{
                model:GroupAiMessage,
                as:"GroupAiMessage",
                require:false,
                include:[{
                    model:Character,
                    as:"Character",
                    require:false
                }]
            }],
            where:{
                id:id
            }
        })
        res.status(200).json({
            status: true,
            status_code: 200,
            group:group,
            message: "update successfully",
        });
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



exports.characterDelete = async (req,res)=>{
    try{
        const id = req?.body?.id
        const deleteCharacter = await Character.update({
            is_deleted:1
        },{
            where:{
                id:id
            }
        })
        if(deleteCharacter){
            res.status(200).json({
                status: true,
                status_code: 200,
                message: "delete successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "delete failed",
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


exports.groupDelete = async (req,res)=>{
    try{
        const id = req?.body?.id
        const deleteCharacter = await Group.update({
            is_deleted:1
        },{
            where:{
                id:id
            }
        })
        if(deleteCharacter){
            res.status(200).json({
                status: true,
                status_code: 200,
                message: "delete successfully",
            });
        }else{
            res.status(400).json({
                status: false,
                status_code: 400,
                message: "delete failed",
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

exports.groupImage = async (req,res) =>{
    try{
           const id = req?.body?.id
           const file = req?.file;
           const imagePath = req?.file?.path;
           console.log(req)
           if (!file) {
             return res.status(400).json({
               status: false,
               status_code: 400,
               message: "No image uploaded",
             });
           }
       
           const array = imagePath.split("public");
           const directory = array[array.length - 1];
           const normalizedPath = directory.replace(/\\/g, "/");
  
           const update = await Group.update(
             { group_image: normalizedPath },
             { where: { id: id } }
           );
       
           if (!update) {
             return res.status(400).json({
               status: false,
               status_code: 400,
               message: "Update failed",
             });
           }
       
           
           res.status(200).json({
             status: true,
             status_code: 200,
             message: "Image uploaded successfully, video processing started",
           });
       
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