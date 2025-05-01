const express = require("express");
const router = express.Router();

const slotRoute = require("./slotRoute");
const isUserAuthenticateMiddleware = require("../../middleware/user/isUserAuthenticateMiddleware");

const defaultRoutes = [
    {
        prefix: "/",
        route: slotRoute,
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