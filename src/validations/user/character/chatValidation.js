const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User,Chat} = require("../../../models");

const chatValidation = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('character_id')
            .exists()
            .withMessage('character_id is required')
        
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

module.exports = chatValidation;
