const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const {Plan} =require("../../../models")

const updatePlan = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('plan_name')
            .exists()
            .withMessage("plan_name is required"),
        body('credit')
            .exists()
            .withMessage("credit is required"),
          
        body('price')
            .exists()
            .withMessage("price is required"),
        body('id')
            .exists()
            .withMessage("id is required")
            .isInt()
            .withMessage("id must be int")
        .custom(async (value) => {
                if (value) {
                    const plan = await Plan.findOne({ where: { id: payload?.id } });
                    if (!plan) {
                        throw new Error( "plan does not exist")
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

module.exports = updatePlan;
