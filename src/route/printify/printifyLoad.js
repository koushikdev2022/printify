const express = require("express");
const router = express.Router();

const printifyRoute = require("./printifyRoute")
const isAuthenticate = require("../../middleware/user/isUserAuthenticateMiddleware")

const defaultRoutes = [
    {
        prefix: "/printify",
        route: printifyRoute,
        middleware:isAuthenticate
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