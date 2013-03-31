var assert = require('chai').assert;
var middleware = require('../');


describe('Middleware', function(done) {

  it('fails', function() {

    assert.equal(middleware('foo'), 'bar');
  });

});