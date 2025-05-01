const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User,AiCharacter } = require("../../../models");

const firstStep = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('company_name')
            .exists()
            .withMessage('company_name is required'),
        body('company_website_url')
            .exists()
            .withMessage('company_website_url is required'),
        body('product_service')
            .exists()
            .withMessage('product_service is required'),
        body('ideal_customer')
            .exists()
            .withMessage('ideal_customer is required'),
        body('is_b2b_b2c')
            .exists()
            .withMessage('Please provide B2B or B2C')
        
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

module.exports = firstStep;
