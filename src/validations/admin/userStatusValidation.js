const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { User } = require("../../models");

const userStatus = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('id')
            .exists()
            .withMessage("id is required")
            .isInt()
            .withMessage("id must be int")
            .custom(async (value) => {
                if (value) {
                    const user = await User.findOne({ where: { id:  payload?.id } });
                    if (!user) {
                        throw new Error( "user does not exist")
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

module.exports = userStatus;
