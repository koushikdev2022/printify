const express = require("express");
const router = express.Router();

const userLoadRoute = require("./user/userLoad")
const userAuthRoute = require("./user/authRoute");
const charaterLoad = require("./character/characterLoad")
const aiCharacterLoad = require("./aiCharacter/aiCharacterLoad");
const planLoad = require("../route/plan/planLoad");
const adminLoad = require("./admin/adminLoad")
const slotLoad = require("./slot/slotLoad")

const defaultRoutes = [
    {
        prefix: "/user",
        route: userLoadRoute,
    },
    {
        prefix: "/slot",
        route: slotLoad,
    },
    {
        prefix: "/",
        route: charaterLoad,
    },
    {
        prefix: "/",
        route: aiCharacterLoad,
    },
    {
        prefix: "/",
        route: planLoad,
    },
    {
        prefix: "/admin",
        route: adminLoad,
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