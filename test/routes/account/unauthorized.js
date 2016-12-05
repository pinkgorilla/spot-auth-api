require("should");
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require("supertest");
var ObjectId = require("mongodb").ObjectId;
var Account = require("spot-module").test.data.auth.account;
var request = Request(host);

it("#01. get list without security token - [GET]/accounts", function(done) {
    request
        .get("/accounts")
        .set("Accept", "application/json")
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it("#02. get data without security token - [GET]/accounts/:id", function(done) {
    request
        .get(`/accounts/${new ObjectId()}`)
        .set("Accept", "application/json")
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it("#03. create data without security token - [GET]/accounts", function(done) {
    request
        .post("/accounts")
        .set("Accept", "application/json")
        .send({})
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});


it("#04. update data without security token - [GET]/accounts/:id", function(done) {
    request
        .put(`/accounts/${new ObjectId()}`)
        .set("Accept", "application/json")
        .send({})
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});


it("#05. delete data without security token - [GET]/accounts/:id", function(done) {
    request
        .delete(`/accounts/${new ObjectId()}`)
        .set("Accept", "application/json")
        .expect(401)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});
