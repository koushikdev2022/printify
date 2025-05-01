const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../../models");

const forgetPasswordValidation = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage( "email is not valid format")
            .custom(async (value) => {
                if (value) {
                    const user = await User.findOne({ where: { email: value } });
                    if (!user) {
                        throw new Error( "email does not exist")
                    }
                }
            }),
        body('base_url')
            .notEmpty()
            .withMessage("base_url is required")
            .isString()
            .withMessage("base_url must be a string"),
            
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

module.exports = forgetPasswordValidation;
