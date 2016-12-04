function test(name, path) {
    describe(name, function() {
        require(path);
    });
}

before('initialize server', function(done) {
    var server = require('../server');
    server()
        .then((server) => {
            done();
        });
});


describe('@spot-auth-webapi', function() {
    this.timeout(2 * 60000);

    test("~/roles", "./role");
});
