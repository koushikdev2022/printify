const express = require("express");
const router = express.Router();

const adminRoute = require("./adminRoute")
const adminUserRoute = require("./adminUserRoute")
const planRoute = require("../admin/planRoute")
const characterRoute = require("../admin/characterRoute");
const isAdminAuthenticateMiddleware = require("../../middleware/admin/isAdminAuthenticateMiddleware")
const resetPasswordRoute = require("./resetPasswordRoute");
const profileRoute = require("./profileRoute")
const defaultRoutes = [
    {
        prefix: "/auth",
        route: adminRoute,
    },
    {
        prefix: "/user",
        route: adminUserRoute,
        middleware:isAdminAuthenticateMiddleware
    },
    {
        prefix: "/plan",
        route: planRoute,
        middleware:isAdminAuthenticateMiddleware
    },
    {
        prefix: "/character",
        route: characterRoute,
        middleware:isAdminAuthenticateMiddleware
    },
    {
        prefix: "/profile",
        route: profileRoute,
        middleware:isAdminAuthenticateMiddleware
    },
    {
        prefix: "/reset-password",
        route: resetPasswordRoute,
        middleware:isAdminAuthenticateMiddleware
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