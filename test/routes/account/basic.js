require('should');
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require('supertest');
var ObjectId = require("mongodb").ObjectId;
var Account = require("spot-module").test.data.auth.account;
var AccountModel = require("spot-models").auth.Account;
var validate = require("spot-models").validator.auth.account;
var request = Request(host);
var jwt;

before("#00. get security token", function(done) {
    var getToken = require("../../token");
    getToken()
        .then((token) => {
            jwt = token;
            done();
        })
        .catch(e => {
            done(e);
        });
});

it('#01. get list of accounts - [GET]/accounts', function(done) {
    request
        .get('/accounts')
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", "application/json")
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Array);
                done();
            }
        });
});

it('#02. get account by unknown id - [GET]/accounts/:id', function(done) {
    request
        .get(`/accounts/${new ObjectId()}`)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(404)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#03. get account by id - [GET]/accounts/:id', function(done) {
    Account.getTestData()
        .then((account) => {
            request
                .get(`/accounts/${account._id}`)
                .set("authorization", `JWT ${jwt}`)
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", "application/json")
                .end(function(err, response) {
                    if (err)
                        done(err);
                    else {
                        var result = response.body;
                        result.should.have.property("apiVersion");
                        result.should.have.property('data');
                        result.data.should.instanceOf(Object);

                        var data = new AccountModel(result.data);
                        validate(data);
                        done();
                    }
                });
        })
        .catch((e) => {
            done(e);
        });
});

it('#04. create account by empty data - [POST]/accounts', function(done) {
    request
        .post("/accounts")
        .send({})
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(400)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('message');
                result.should.have.property('error');
                var error = result.error;
                // error.should.have.property("code");
                // error.should.have.property("name");
                done();
            }
        });
});

var newData;
var newDataLocation;
it('#05. create new account and set header.location- [POST]/accounts', function(done) {
    Account.getNewData()
        .then((account) => {
            newData = account;
            request
                .post("/accounts")
                .send(account)
                .set("authorization", `JWT ${jwt}`)
                .set("Accept", "application/json")
                .expect(201)
                .expect("Content-Type", "application/json")
                .end(function(err, response) {
                    if (err)
                        done(err);
                    else {
                        var result = response.body;
                        result.should.have.property("apiVersion");
                        result.should.have.property('message');

                        var header = response.header;
                        header.should.have.property("location");
                        newDataLocation = header.location;

                        done();
                    }
                });
        })
        .catch((e) => {
            done(e);
        });
});

it('#06. get created account from header.location [GET]/accounts/:id', function(done) {
    request
        .get(newDataLocation)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", "application/json")
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Object);

                var data = new AccountModel(result.data);
                validate(data);
                newData = data;
                done();
            }
        });
});

it('#07. update created account with unknown id - [PUT]/accounts/:id', function(done) {
    request
        .put(`/accounts/${new ObjectId()}`)
        .send(newData)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(404)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#08. update created account - [PUT]/accounts/:id', function(done) {
    newData.profile.firstname += "[updated]";
    request
        .put(`/accounts/${newData._id}`)
        .send(newData)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(204)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#09. get updated account - [GET]/accounts/:id', function(done) {
    request
        .get(newDataLocation)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", "application/json")
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Object);
                
                var data = new AccountModel(result.data);
                data.profile.firstname.should.equal(newData.profile.firstname);
                validate(data);
                newData = data;
                done();
            }
        });
});

it('#10. get list of accounts with keyword - [GET]/accounts?keyword', function(done) {
    request
        .get(`/accounts?keyword=${newData.username}`)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", "application/json")
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Array);
                var data = result.data;
                data.length.should.equal(1); 
                newData.username.should.equal(data[0].username);

                result.should.have.property('info');
                result.info.should.instanceOf(Object);
                var info = result.info;
                info.should.have.property("count");
                info.count.should.equal(1);
                done();
            }
        });
});

it('#11. delete created data with unknown id - [DELETE]/accounts/:id', function(done) {
    request
        .delete(`/accounts/${new ObjectId()}`)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(404)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#12. delete created data - [DELETE]/accounts/:id', function(done) {
    request
        .delete(`/accounts/${newData._id}`)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(204)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#13. get deleted account - [GET]/accounts/:id', function(done) {
    request
        .get(newDataLocation)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(404)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                done();
            }
        });
});

it('#14. get list of accounts with keyword - [GET]/accounts?keyword', function(done) {
    request
        .get(`/accounts?keyword=${newData.code}`)
        .set("authorization", `JWT ${jwt}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", "application/json")
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Array);
                var data = result.data;
                data.length.should.equal(0);

                result.should.have.property('info');
                result.info.should.instanceOf(Object);
                var info = result.info;
                info.should.have.property("count");
                info.count.should.equal(0);
                done();
            }
        });
});
