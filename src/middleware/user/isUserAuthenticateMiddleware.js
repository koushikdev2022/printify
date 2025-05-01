const { verifyAccessToken } = require("../../helper/generateAccessToken");

const isUserAuthenticateMiddleware = async (req, res, next) => {

    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.sendStatus(401);
      }
  
      const result = await verifyAccessToken(token);
  
      if (!result.success) {
        return res.status(403).json({ error: result.error });
      }
  
      req.user = result.data;
  
      if (req?.user?.tokenType !== 'user') {
        return res.status(422).json({
          status: false,
          status_code: 422,
          message: "you are not a user to access.!",
        })
      }
      next();
    } catch (error) {
      console.error("Error isUserAuthenticateMiddleware", error);
      const status = error?.status || 500;
      const message = error?.message || "INTERNAL_SERVER_ERROR";
      return res.status(status).json({ message, status: false, status_code: status });
    }
  }
  
  module.exports = isUserAuthenticateMiddleware;