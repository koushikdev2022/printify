const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../../models");

const resetPasswordValidation = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('password')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 8 })
            .withMessage('password minimum 8 character')
            .isString()
            .withMessage( "password must be a string"),
        body('confirm_password')
            .notEmpty()
            .withMessage("confirm_password is required")
            .isLength({ min: 8 })
            .withMessage('confirm_password minimum 8 character')
            .isString()
            .withMessage("confirm_password must be a string")
            .custom(async (value) => {
                if (value!=req?.body?.password) {
                    throw new Error( "password and confirm password does not match")
                }
            }),
        body('user_id')
            .notEmpty()
            .withMessage("user_id is required")
            .isInt()
            .withMessage("user_id must be an integer")
            .custom(async (value) => {
                if (value) {
                    const user = await User.findOne({ where: { id: value } });
                    if (!user) {
                        throw new Error( "userId does not exist")
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

module.exports = resetPasswordValidation;
