const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User,AiCharacter } = require("../../../models");

const secondStep = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('age_start')
            .exists()
            .withMessage('age_start is required'),
        body('age_end')
            .exists()
            .withMessage('age_end is required'),
        body('country')
            .exists()
            .withMessage('country is required'),
        body('job_role')
            .exists()
            .withMessage('job_role is required'),
        body('key_problem')
            .exists()
            .withMessage('key_problem is required'),
        body('buying_product')
            .exists()
            .withMessage('Please share what motivates them to buy'),
        body('concerns')
            .exists()
            .withMessage('Please share what concerns or objectives do they usually have'),
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

module.exports = secondStep;
