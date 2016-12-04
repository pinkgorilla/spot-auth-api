require('should');
var request = require('supertest');
var uri = `${process.env.IP}:${process.env.PORT}`;

it('#01. Should be able to get list', function(done) {
    request(uri)
        .get('/roles')
        .expect(200)
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
