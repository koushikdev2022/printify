const jwt = require('jsonwebtoken');

const generateAccessToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    dob: user.dob,
    is_active: user.is_active,
    tokenType:"user",
  };

  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1d' }; 

  return jwt.sign(payload, secret, options);
}

const generateAdminAccessToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    dob: user.dob,
    is_active: user.is_active,
    tokenType:"admin",
  };

  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1d' }; 

  return jwt.sign(payload, secret, options);
}

const userRefreshAccessToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    dob: user.dob,
    is_active: user.is_active,
    tokenType:"user",
  };

  const secret = process.env.JWT_SECRET_REFRESH;
  const options = { expiresIn: '30d' };

  return jwt.sign(payload, secret, options);
}


const adminRefreshAccessToken = async (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    dob: user.dob,
    is_active: user.is_active,
    tokenType:"admin",
  };

  const secret = process.env.JWT_SECRET_REFRESH;
  const options = { expiresIn: '30d' };

  return jwt.sign(payload, secret, options);
}


const verifyAccessToken = async (token) => {
  const secret = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const verifyRefreshToken = async (token) => {
  const secret = process.env.JWT_SECRET_REFRESH;
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { generateAccessToken, userRefreshAccessToken, verifyAccessToken, verifyRefreshToken,generateAdminAccessToken,adminRefreshAccessToken }
