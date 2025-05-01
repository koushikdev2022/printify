const {Plan} = require("../../../../models")


exports.list = async(req,res)=>{
    try {
        const limit = req?.body?.limit || 10;
        const page = req?.body?.page || 1;
        const offset = (page - 1) * limit;
        const query = {
            where: {},
            order: [['created_at', 'desc']],
            limit: limit,
            offset: offset,
        }
        query.where.is_active=1
        const totalPlan = await Plan.count({
            where: query.where,
            distinct: true
        })
        const plan = await Plan.findAll(query)
        if (plan) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                data: plan,
                data_count: totalPlan,
                page: page
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: plan,
                data_count: totalPlan,
                page: page
            })
        }
    } catch (err) {
        console.log("Error in login authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status
        })
    }
}