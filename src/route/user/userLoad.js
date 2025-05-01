const express = require("express");
const router = express.Router();

const authRoute = require("./authRoute")
const userOtpRoute = require("./userOtpRoute");
const videoAttributeRoute = require('./videoAttributeRoute')
const videoRoute = require("./videoRoute")
const tokenRoute = require("./tokenRoute")
const forgetPasswordRoute = require("./forgetPasswordRoute");
const planRoute = require("../user/planRoute");
const paymentRoute = require("./paymentRoute")
const isUserAuthenticateMiddleware = require("../../middleware/user/isUserAuthenticateMiddleware")
const profileRoute = require("./profileRoute")
const resetPasswordRoute = require("./resetpasswordRoute");
const addressRoute =require("./addressRoute")

const defaultRoutes = [
    {
        prefix: "/auth",
        route: authRoute,
    },
    {
        prefix: "/video_attribute",
        route: videoAttributeRoute,
    },
    {
        prefix: "/video",
        route: videoRoute,
    },
    {
        prefix: "/otp",
        route: userOtpRoute,
    },
    {
        prefix: "/address",
        route: addressRoute,
        middleware:isUserAuthenticateMiddleware
    },
    {
        prefix: "/token",
        route: tokenRoute,
    },
    {
        prefix: "/forget-password",
        route: forgetPasswordRoute,
    },
    {
        prefix: "/plan",
        route: planRoute,
        middleware:isUserAuthenticateMiddleware
    },
    {
        prefix: "/payment",
        route: paymentRoute,
        middleware:isUserAuthenticateMiddleware
    },
    {
        prefix: "/profile",
        route: profileRoute,
        middleware:isUserAuthenticateMiddleware
    },
    {
        prefix: "/reset-password",
        route: resetPasswordRoute,
        middleware:isUserAuthenticateMiddleware
    },
]
defaultRoutes.forEach((route) => {
    if (route.middleware) {
        router.use(route.prefix, route.middleware, route.route);
    } else {
        router.use(route.prefix, route.route);
    }
});

module.exports = router;