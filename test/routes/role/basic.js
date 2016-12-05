require("should");
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require("supertest");
var ObjectId = require("mongodb").ObjectId;
var Role = require("spot-module").test.data.auth.role;
var validate = require("spot-models").validator.auth.role;
var request = Request(host);
var jwt;

before("#00. get security token", function(done) {
    var getToken = require("../../token");
    getToken()
        .then((token) => {
            jwt = token;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#01. get list of roles - [GET]/roles", function(done) {
    request
        .get("/roles")
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
                result.should.have.property("data");
                result.data.should.instanceOf(Array);
                done();
            }
        });
});

it("#02. get role by unknown id - [GET]/roles/:id", function(done) {
    request
        .get(`/roles/${new ObjectId()}`)
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

it("#03. get role by id - [GET]/roles/:id", function(done) {
    Role.getTestData()
        .then((role) => {
            request
                .get(`/roles/${role._id}`)
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
                        result.should.have.property("data");
                        result.data.should.instanceOf(Object);
                        validate(result.data);
                        done();
                    }
                });
        })
        .catch((e) => {
            done(e);
        });
});

it("#04. create role by empty data - [POST]/roles", function(done) {
    request
        .post("/roles")
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
                result.should.have.property("message");
                result.should.have.property("error");
                var error = result.error;
                error.should.have.property("code");
                error.should.have.property("name");
                done();
            }
        });
});

var newData;
var newDataLocation;
it("#05. create new role and set header.location- [POST]/roles", function(done) {
    Role.getNewData()
        .then((role) => {
            newData = role;
            request
                .post("/roles")
                .send(role)
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
                        result.should.have.property("message");

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

it("#06. get created role from header.location [GET]/roles/:id", function(done) {
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
                result.should.have.property("data");
                var data = result.data;
                data.should.instanceOf(Object);
                data.code.should.equal(newData.code);
                data.name.should.equal(newData.name);
                data.description.should.equal(newData.description);
                validate(data);
                newData = data;
                done();
            }
        });
});

it("#07. update created role with unknown id - [PUT]/roles/:id", function(done) {
    request
        .put(`/roles/${new ObjectId()}`)
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

it("#08. update created role - [PUT]/roles/:id", function(done) {
    newData.name += "[updated]";
    request
        .put(`/roles/${newData._id}`)
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

it("#09. get updated role - [GET]/roles/:id", function(done) {
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
                result.should.have.property("data");
                var data = result.data;
                data.should.instanceOf(Object);
                data.code.should.equal(newData.code);
                data.name.should.equal(newData.name);
                data.description.should.equal(newData.description);
                validate(data);
                newData = data;
                done();
            }
        });
});

it("#10. get list of roles with keyword - [GET]/roles?keyword", function(done) {
    request
        .get(`/roles?keyword=${newData.code}`)
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
                result.should.have.property("data");
                result.data.should.instanceOf(Array);
                var data = result.data;
                data.length.should.equal(1);
                newData.code.should.equal(data[0].code);
                newData.name.should.equal(data[0].name);
                newData.description.should.equal(data[0].description);

                result.should.have.property("info");
                result.info.should.instanceOf(Object);
                var info = result.info;
                info.should.have.property("count");
                info.count.should.equal(1);
                done();
            }
        });
});

it("#11. delete created data with unknown id - [DELETE]/roles/:id", function(done) {
    request
        .delete(`/roles/${new ObjectId()}`)
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

it("#12. delete created data - [DELETE]/roles/:id", function(done) {
    request
        .delete(`/roles/${newData._id}`)
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

it("#13. get deleted role - [GET]/roles/:id", function(done) {
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

it("#14. get list of roles with keyword - [GET]/roles?keyword", function(done) {
    request
        .get(`/roles?keyword=${newData.code}`)
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
                result.should.have.property("data");
                result.data.should.instanceOf(Array);
                var data = result.data;
                data.length.should.equal(0);

                result.should.have.property("info");
                result.info.should.instanceOf(Object);
                var info = result.info;
                info.should.have.property("count");
                info.count.should.equal(0);
                done();
            }
        });
});
