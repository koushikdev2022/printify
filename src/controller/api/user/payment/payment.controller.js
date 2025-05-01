const {Transaction,Wallet,User,Plan,UserAddress,SubscriptionModel} = require("../../../../models")
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const { PayPalClient } = require('../../../../helper/paypalHelper'); 

const { mailCogfig } = require("../../../../config/mailConfig");
const path = require("path");
const ejs = require('ejs');

exports.initiate = async(req,res)=>{
    try{
      const payload = req?.body
      const userId = req?.user?.id
      const  planDetails = await Plan.findByPk(payload?.plan_id)
      const addressId = req?.body?.address_id || 0 
      const transactionCreate = await Transaction.create({
           user_id:userId,
           plan_id:payload?.plan_id,
           total_balance:planDetails?.price,
           transaction_type:"credit",
           transaction_success:"initiate",
           address_id:addressId,
           total_credit:planDetails?.credit,
      })
      if(transactionCreate?.id>0){
        res.status(201).json({
            messsage:"create successfully",
            status:true,
            data:transactionCreate,
            status_code:201,
        })
      }else{
        res.status(400).json({
            messsage:"creation failed",
            status:false,
            status_code:400,
        })
      }
    }catch (err) {
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


exports.stripePaymentIntent = async(req,res)=>{
    try {
        const payload = req?.body;
        const payPalClient = PayPalClient(); 
        const planDetails = await Plan.findByPk(payload?.plan_id);
        const amount = (planDetails?.price).toFixed(2); 
        const currency = planDetails?.currency;
        const orderRequest = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
        };
        const order = await payPalClient.execute(new paypal.orders.OrdersCreateRequest().requestBody(orderRequest));
        const transactionData = await Transaction.findByPk(payload?.transaction_id);
        const update = transactionData.update({
            payment_intend: order.result.id,
            transaction_success: "pending",
        });
        res.status(201).json({
            status: true,
            orderId: order.result.id,
            status_code: 201,
            message: "PayPal payment order created",
        });
    } catch (err) {
        console.error("Error in PayPal payment creation: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status,
        });
    }
}


exports.walletUpdate = async(req,res) =>{
    try{
          const payload = req?.body;
          const user_id = req?.user?.id;
          const userData = await User.findByPk(user_id)
          let queryStatus = false;
          const transactionDetails = await Transaction.findByPk(payload?.transaction_id);
          const planDetails = await Plan.findByPk(payload?.plan_id)
          const userWallet = await Wallet.findOne({
            where:{
                user_id:user_id
            }
          })
          if(!userWallet){
             const create = await Wallet.create({
                user_id:user_id,
                balance:planDetails?.credit,
                account_freeze:0,
                is_free:0,
                is_active:0
             })
             if(create.id > 0){
                queryStatus=true
             }else{
                queryStatus=false
             }
          }else{
            let newBalance
            if(userWallet?.is_free==1){
                console.log("hellow")
                newBalance =  userWallet?.balance + planDetails?.credit//free
            }else{
                console.log("by")
                newBalance = userWallet?.balance + planDetails?.credit
            }
            console.log(newBalance)
            const walletUpdate = await Wallet.update({
                    balance:newBalance,
                    is_free:0
                },{
                    where:{
                        user_id:user_id
                    }
                })
            if(walletUpdate){
                    const transporter = await mailCogfig()
                    const emailTemplatePathOtp = path.join(__dirname,"../../../../",'templates', 'credit.ejs');
                    const emailContentOtp = await ejs.renderFile(emailTemplatePathOtp, {
                        first_name: userData.first_name, 
                        otp:planDetails?.credit
                    });
                    const mailOptionsOtp = {
                        from: process.env.SMTP_USER,
                        to: userData?.email, 
                        subject: "credit update",
                        html: emailContentOtp,
                    };
                    await transporter.sendMail(mailOptionsOtp);
                queryStatus=true
            }else{
                queryStatus=false
            }
          }
          if(queryStatus){
             const updateTransactionDetails = await transactionDetails.update({
                transaction_success:"success"
             })
             if(updateTransactionDetails){
                res.status(200).json({
                    status:true,
                    status_code:200,
                    message:"update payment and wallet"
                });
             }else{
                res.status(400).json({
                    status:false,
                    status_code:400,
                    message:"transaction update failed"
                });
             }
          }else{
                const updateTransactionDetails = await transactionDetails.update({
                    transaction_success:"failed"
                })
                res.status(400).json({
                    status:false,
                    status_code:400,
                    message:"payment deduct but wallet not update please contact to admin"
                });
          }
    }catch (err) {
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




exports.transactionFailed = async(req,res) =>{
    try{
          const payload = req?.body;
          const user_id = req?.user?.id;
          const transactionDetails = await Transaction.findByPk(payload?.transaction_id);
          const updateTransactionDetails = await transactionDetails.update({
            transaction_success:"failed"
          })
          if(updateTransactionDetails){
            res.status(200).json({
                status:true,
                status_code:200,
                message:"update successfully"
            });
          }else{
            res.status(400).json({
                status:false,
                status_code:400,
                message:"transaction failed"
            });
          }
    }catch (err) {
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


exports.transactionDetails = async(req,res)=>{
    try{
          const userId = req?.user?.id
          const limit = req?.body?.limit || 10;
          const page = req?.body?.page || 1;
          const offset = (page-1) * limit; 
          let totalPage
          const query = {
              include:[{
                 model:Plan,
                 as:"Plan",
                 required:false
              },{
                model:User,
                as:"User",
                required:false
              },{
                model:UserAddress,
                as:"UserAddress",
                required:false
              }],
              order:[['created_at','desc']],
              where:{},
              limit:limit,
              offset:offset
          }
          query.where.user_id=userId
          const count = await Transaction.count({
            where:query.where,
            distinct: true
          })
          totalPage = Math.ceil(count/limit);
          const findTransaction = await Transaction.findAll(query)
          if (findTransaction) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                total_page:totalPage,
                data: findTransaction,
                data_count: count,
                page: page
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: findTransaction,
                total_page:totalPage,
                data_count: count,
                page: page
            })
        }
    }catch (err) {
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



exports.wallet = async(req,res)=>{
    try{
          const userId = req?.user?.id
          const query = {
              where:{},
          }
          query.where.user_id=userId
          const findWallet = await Wallet.findAll(query)
          if (findWallet) {
            res.status(200).json({
                messsage: "data found",
                status: true,
                status_code: 200,
                data: findWallet,
            })
        } else {
            res.status(200).json({
                messsage: "no data found",
                status: true,
                status_code: 200,
                data: findWallet,
            })
        }
    }catch (err) {
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



exports.walletDeduct = async(req,res)=>{
    try{
        const userId = req?.user?.id;
        const userWallet = await Wallet.findOne({
            where:{
                user_id:userId
            }
        })
        if(userWallet){
            const createTransaction = await Transaction.create({
                user_id:userId,
                plan_id:0,
                address_id: 0,
                total_balance:0,
                total_credit: 90,
                payment_intend:"NULL",
                transaction_type:"debit",
                transaction_success:"success"

            })
            const newBalance = userWallet?.balance - 90;
            const updateWallet = await Wallet.update({
                 balance:newBalance
            },{
                where:{
                    user_id:userId
                }
            })
            if(updateWallet){
                res.status(200).json({
                    message:"deducted",
                    status:true,
                    status_code:200
                })
            }else{
                res.status(400).json({
                    message:"true",
                    status:false,
                    status_code:400
                })
            }
        }else{
            res.status(200).json({
                messsage: "invalid token",
                status: false,
                status_code: 400,
            })
        }
    }catch (err) {
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

exports.createSubscription = async (req,res) =>{
    try{
            const payload = req?.body
            const email = req?.user?.email
            if(!payload?.plan_id){
                return res.status(422).json({
                    message:"plan id is required",
                    status:true,
                    status_code:422
                })
            }
            const plan_data = await Plan.findByPk(payload?.plan_id)
            const customer = await Stripe.customers.create({
                email,
                payment_method: "pm_card_visa",
                invoice_settings: {
                  default_payment_method: "pm_card_visa",
                },
            });
            const customer_id = customer?.id
            const plan_k = plan_data?.plan_key
            const subscription = await Stripe.subscriptions.create({
                customer: customer_id,
                items: [{ price: plan_k }],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
            });
            const paymentIntent = subscription.latest_invoice.payment_intent;
            const subscriptionId = subscription.id;
            const clientSecret = paymentIntent.client_secret;
            return res.status(200).json({
                message:"subscription successfully",
                paymentIntent:paymentIntent,
                subscriptionId:subscriptionId,
                clientSecret:clientSecret,
                customer_id:customer_id,
                stripe_publish:process.env.STRIPE_PUBLISHABLE_KEY,
            })
    }catch (err) {
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



exports.completePayment = async(req,res) =>{
    try{
            const payload = req?.body
            
            if(!payload?.subscription_id){
                return res.status(422).json({
                    message:"subscription_id is require",
                    status:false,
                    status_code:422
                })
            }
            if(!payload?.secret_key){
                return res.status(422).json({
                    message:"secret_key is require",
                    status:false,
                    status_code:422
                })
                
            }
            if(!payload?.plan_id){
                return res.status(422).json({
                    message:"plan_id is require",
                    status:false,
                    status_code:422
                })
            }
            if(!payload?.cust_id){
                return res.status(422).json({
                    message:"cust_id is require",
                    status:false,
                    status_code:422
                })
            }
            const planData = await Plan.findByPk(payload?.plan_id)
            const subscription = await Stripe.subscriptions.retrieve(payload?.subscription_id);
            const subscriptionStatus  = subscription?.status
            if(subscriptionStatus == "success"){
                const create = await SubscriptionModel.create({
                    user_id: req?.user?.id,
                    plan_id:payload?.plan_id,
                    stripe_payment_key:payload?.secret_key,
                    customer_stripe_id: payload?.cust_id,
                    stripe_subscription_type: payload?.subscription_id,
                    stripe_subscription_start_date: new Date(), 
                    stripe_subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    subscription_type: 1, 
                    status: 1, 
                    created_at: new Date(),
                    updated_at: new Date()
                  });
                  if(create?.id > 0 ){
                    return res.status(201).json({
                        message:"subscription created successfully",
                        status:true,
                        status_code:201
                    })
                  }else{
                    return res.status(400).json({
                        message:"subscription failed",
                        status:false,
                        status_code:400
                    })
                  }
            }else{
                return res.status(400).json({
                    message:"payment not granted if deduct contract to admin",
                    status:false,
                    status_code:400
                })
            }
           
    }catch (err) {
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

exports.plan = async(req,res)=>{
    try{
            const userId = req?.user?.id
            const query = {
                where:{},
                include:[
                   {
                    model:SubscriptionModel,
                    as:"SubscriptionModel",
                    require:false,
                    include:[{
                        model:Plan,
                        as:"Plan",
                        require:false,
                    }]
                   } 
                ],
                order: [[{ model: SubscriptionModel, as: 'SubscriptionModel' }, 'id', 'DESC']]
            }
            query.where = {
                id:userId
            }
            const userData = await User.findAll(query); 
            return res.status(200).json({
                message:"data found",
                status:true,
                status_code:200,
                data:userData
            })
    }catch (err) {
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


exports.cancel = async(req,res)=>{
    try{
        const payload = req?.body
        if(!payload?.subscription_id){
            return res.status(422).json({
                message:"subscription_id is require",
                status:false,
                status_code:422
            })
        }
        const deletedSubscription = await Stripe.subscriptions.del(payload?.subscription_id);
        return res.status(200).json({
            message:"cancel successfully",
            status:true,
            status_code:200,
        })
    }catch (err) {
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