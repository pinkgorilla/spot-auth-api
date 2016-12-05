const apiVersion = "1.0.0";
var RoleManager = require("spot-module").managers.auth.RoleManager;
var getJWTRouter = require("../jwt-router-factory");

function getRouter() {
    return getJWTRouter(RoleManager, apiVersion);
}
module.exports = getRouter;
