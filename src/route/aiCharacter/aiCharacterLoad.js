const express = require("express");
const router = express.Router();

const aiCharacterRoute = require("./aiCharacterRoute");

const defaultRoutes = [
    {
        prefix: "/ai-character",
        route: aiCharacterRoute,
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