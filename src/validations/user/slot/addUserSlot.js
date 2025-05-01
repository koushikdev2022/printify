const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const {UserSlot,SlotPrice} = require("../../../models")

const addUserSlot = async (req, res, next) => {
    const payload = req?.body;
    const t = req.t;
    const validationRules = [
        body('id')
            .exists()
            .withMessage("id is required")
            .custom(async (value) => {
                if (value) {
                    const userSlot = await SlotPrice.findOne({ where: { id:  payload?.id,is_deleted:0,is_active:1,free:0 } });
                    if (!userSlot) {
                        throw new Error( "SlotPrice does not exist")
                    }
                }
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

module.exports = addUserSlot;