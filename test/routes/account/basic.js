 var basicTest = require("../basic-test-factory");

 basicTest({
     uri: "/accounts",
     model: require("spot-models").auth.Account,
     validate: require("spot-models").validator.auth.account,
     util: require("spot-module").test.data.auth.account,
     keyword: "username"
 });
 