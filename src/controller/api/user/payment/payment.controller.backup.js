
const { Subscription, Plan } = require("../../../../models")

const axios = require('axios');


const client = process.env.PAYPAL_CLIENT_ID
const secret = process.env.PAYPAL_CLIENT_SECRET

const url = process.env.PAYPAL_API



async function generateAccessToken() {
    const response = await axios({
        url: `${url}/v1/oauth2/token`,
        method: 'post',
        auth: {
            username: client,
            password: secret,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: 'grant_type=client_credentials',
    });
    return response.data.access_token;
}


exports.createProduct = async (req, res) => {
    const accessToken = await generateAccessToken();
    try {
        const response = await axios.post(`${url}/v1/catalogs/products`, {
            name: 'My SaaS Product',
            description: 'Subscription Plans for SaaS',
            type: 'SERVICE',
            category: 'SOFTWARE'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createPlan = async (req, res) => {
    const { product_id, plan_name, price } = req.body;
    const accessToken = await generateAccessToken();
    try {
        const response = await axios.post(`${url}/v1/billing/plans`, {
            product_id,
            name: plan_name,
            billing_cycles: [{
                frequency: { interval_unit: 'MONTH', interval_count: 1 },
                tenure_type: 'REGULAR',
                sequence: 1,
                total_cycles: 0,
                pricing_scheme: {
                    fixed_price: { value: price, currency_code: 'USD' }
                }
            }],
            payment_preferences: {
                auto_bill_outstanding: true,
                setup_fee_failure_action: 'CONTINUE',
                payment_failure_threshold: 3
            }
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.subscribe =  async (req, res) => {
    const { plan_id } = req?.body;
    const allPlanDetails = await Plan.findOne({
        where: {
            id: plan_id
        }
    });
    
    if (!allPlanDetails) {
        return res.status(404).json({ error: 'Plan not found' });
    }
    
    const planId = allPlanDetails?.price_key; 
    
    if (!planId) {
        return res.status(400).json({ error: 'Plan does not have a PayPal plan_id' });
    }
    
    const accessToken = await generateAccessToken();
    
    try {
        const response = await axios.post(`${url}/v1/billing/subscriptions`, 
            { plan_id: planId }, 
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        res.status(200).json({
            status:200,
            data:response.data,
            status:true,
            status_code:200
        });
    } catch (error) {
        res.status(500).json({ 
            status:true,
            status_code:400,
            message: error.response?.data || error.message 
        });
    }
};
// exports.subscribe = async (req, res) => {
//     const { plan_id } = req.body;

//     const allPlanDetails = await Plan.findOne({ where: { id: plan_id } });
//     if (!allPlanDetails) {
//         return res.status(404).json({ error: 'Plan not found' });
//     }

//     const planId = allPlanDetails.price_key; // This should be the PayPal Plan ID
//     if (!planId) {
//         return res.status(400).json({ error: 'Plan does not have a PayPal plan_id' });
//     }

//     const accessToken = await generateAccessToken();

//     try {
//         res.status(200).json({
//             status: 200,
//             data_plan: { plan_id: planId },
//             data:response.data,
//             accessToken:accessToken,
//             status_code: 200
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             status_code: 500,
//             message: error.response?.data || error.message
//         });
//     }
// };


exports.checkSubscriptionStatus = async (req,res) => {
    const accessToken = await generateAccessToken();
    const  id  = req?.body?.id;
    const  order_id  = req?.body?.order_id;
    console.log(order_id)
    if (!id) {
        return res.status(404).json({ error: 'Plan not found' });
    }
    try {
        
        const response = await axios.get(`${url}/v2/checkout/orders/${order_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
        const orderDetails = response.data;

        res.status(200).json({
            status: 'success',
            data: orderDetails
        });
    } catch (error) {
        console.error('Error retrieving order details:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.response?.data || error.message
        });
    }
};


async function generateClientToken(accessToken) {
    try {
        const response = await axios.post('https://api.sandbox.paypal.com/v1/identity/generate-token', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data.client_token;
    } catch (error) {
        console.error("Error generating client token:", error.response?.data || error.message);
        console.error("Full error details:", error.response);  // Log the full error response
        throw new Error("Error generating client token");
    }
}


exports.allIds = async (req, res) => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const secretId = process.env.PAYPAL_CLIENT_SECRET;
        const accessToken = await generateAccessToken();
        const clientToken = await generateClientToken(accessToken);

        const payurl = process.env.PAYPAL_API;

        res.status(200).json({
            status: true,
            status_code: 200,
            clientId: clientId,
            secretId: secretId,
            clientToken: clientToken,  // Renamed to 'clientToken' for clarity
            payurl: payurl,
        });
    } catch (error) {
        console.error("Error processing PayPal request:", error.response?.data || error.message);
        res.status(500).json({
            status: false,
            status_code: 500,
            message: error.response?.data || error.message,
        });
    }
};
