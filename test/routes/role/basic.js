 var basicTest = require("../basic-test-factory");
 basicTest({
     uri: "/roles",
     model: require("spot-models").auth.Role,
     validate: require("spot-models").validator.auth.role,
     util: require("spot-module").test.data.auth.role,
     keyword: "code"
 });
 