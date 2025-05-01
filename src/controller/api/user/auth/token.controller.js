const { verifyAccessToken } = require("../../../../helper/generateAccessToken");

exports.verifyUserToken = async (req,res) =>{
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
    if (req.user) {
        return res.status(200).json({
            status: true,
            status_code: 200,
            message: "user found successfully",
            data: req.user
        })
    } else {
        return res.status(400).json({
            status: false,
            status_code: 400,
            message: "no user found",
        })
    }
    
}