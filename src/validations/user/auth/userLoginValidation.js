const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../../models");

const userLoginValidation = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('username')
            .exists()
            .withMessage("username is required")
            .isString()
            .withMessage("username must be string"),
        body('password')
            .exists()
            .withMessage("password is required")
            .isString()
            .withMessage("password must be a string"),
        body("username")
            .custom(async (value) => {
                if (value) {
                    const user = await User.findOne({ where: { username: value } });
                    if (!user) {
                        throw new Error( "username does not exist")
                    }
                }
            })
        ];

    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.param,
            value: error.value,
            message: error.msg,
        }));

        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            data: formattedErrors,
            status_code: 422,
        });
    }

    next();
};

module.exports = userLoginValidation;
