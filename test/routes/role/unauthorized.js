require('should');
const host = `${process.env.IP}:${process.env.PORT}`;
var Request = require('supertest');
var ObjectId = require("mongodb").ObjectId;
var Role = require("spot-module").test.data.auth.role;
var request = Request(host);

it('#01. get list without security token - [GET]/roles', function(done) {
    request
        .get('/roles')
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

it('#02. get data without security token - [GET]/roles/:id', function(done) {
    request
        .get(`/roles/${new ObjectId()}`)
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

it('#03. create data without security token - [GET]/roles', function(done) {
    request
        .post("/roles")
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


it('#04. update data without security token - [GET]/roles/:id', function(done) {
    request
        .put(`/roles/${new ObjectId()}`)
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


it('#05. delete data without security token - [GET]/roles/:id', function(done) {
    request
        .delete(`/roles/${new ObjectId()}`)
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
