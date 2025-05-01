const express = require("express");
const router = express.Router();

const printifyRoute = require("./printifyRoute")

const defaultRoutes = [
    {
        prefix: "/printify",
        route: printifyRoute,
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