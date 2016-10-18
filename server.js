var restify = require('restify');
restify.CORS.ALLOW_HEADERS.push('authorization');


var passport = require('passport');
var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(passport.initialize());


var authRouter = require('./src/routers/v1/authenticate-router');
authRouter.applyRoutes(server, "/v1/authenticate");

var facebookAuthRouter = require('./src/routers/facebook-auth-router');
facebookAuthRouter.applyRoutes(server, "/facebook");

var accountRouter = require('./src/routers/v1/account-router');
accountRouter.applyRoutes(server, "/v1/accounts");

var roleRouter = require('./src/routers/v1/role-router');
roleRouter.applyRoutes(server, "/v1/roles");

var meRouter = require('./src/routers/v1/me-router');
meRouter.applyRoutes(server, "/v1/me");


server.on('NotFound', function(request, response, cb) {

}); // When a client request is sent for a URL that does not exist, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 404 handler. It is expected that if you listen for this event, you respond to the client.
server.on('MethodNotAllowed', function(request, response, cb) {
    console.log(cb);

}); // When a client request is sent for a URL that does exist, but you have not registered a route for that HTTP verb, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 405 handler. It is expected that if you listen for this event, you respond to the client.
server.on('VersionNotAllowed', function(request, response, cb) {
    console.log(cb);

}); // When a client request is sent for a route that exists, but does not match the version(s) on those routes, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 400 handler. It is expected that if you listen for this event, you respond to the client.
server.on('UnsupportedMediaType', function(request, response, cb) {
    console.log(cb);

}); // When a client request is sent for a route that exist, but has a content-type mismatch, restify will emit this event. Note that restify checks for listeners on this event, and if there are none, responds with a default 415 handler. It is expected that if you listen for this event, you respond to the client.
server.on('after', function(request, response, route, error) {
    console.log(error);

}); // Emitted after a route has finished all the handlers you registered. You can use this to write audit logs, etc. The route parameter will be the Route object that ran.
server.on('uncaughtException', function(request, response, route, error) {
    console.log(error);

}); // Emitted when some handl
server.on('InternalError', function(request, response, route, error) {
    console.log(error);
}); // Emitted when some handl

server.listen(process.env.PORT, process.env.IP);
console.log(`auth server created at ${process.env.IP}:${process.env.PORT}`)