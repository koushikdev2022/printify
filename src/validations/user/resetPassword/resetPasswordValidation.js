const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../../models");
const checkpassword = require("../../../helper/checkPassword");

const resetPasswordValidation = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const userId = req?.user?.id
    
    const validationRules = [
        body('old_password')
            .notEmpty()
            .withMessage('old_password is required')
            .custom(async (value, { req }) => {
                const userId = req?.user?.id;
                if (!userId) {
                    throw new Error('User ID is missing');
                }
                const user = await User.findByPk(userId); 
    
                if (!user) {
                    throw new Error('User does not exist');
                }
                const isPasswordMatch = await checkpassword(value,user?.password);
                if (!isPasswordMatch) {
                    throw new Error('Old password is incorrect');
                }
    
                if (value === req.body.password) {
                    throw new Error('Old password and new password cannot be the same');
                }
    
                return true;
            }),
        body('password')
            .notEmpty()
            .withMessage('password is required'),
        body('confirm_password')
            .notEmpty()
            .withMessage('confirm_password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
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
