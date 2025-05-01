const express = require("express");
const router = express.Router();

const planRoute = require("./planRoute");

const defaultRoutes = [
    {
        prefix: "/plan",
        route: planRoute,
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