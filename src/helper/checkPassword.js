const bcrypt = require("bcrypt");

const checkPassword = async(password,dbpassword) =>{
       passwordCheck = bcrypt.compareSync(password,dbpassword);
       return passwordCheck;
}

module.exports = checkPassword