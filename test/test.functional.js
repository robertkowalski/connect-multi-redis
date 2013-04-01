var assert = require('chai').assert;
var middleware = require('../');
var connect = require('connect');

describe('swapSession', function(done) {

  it('should swap the function in the stack', function() {
    var app = {};
    var session = connect.session({ secret: 'keyboard cat'});
    session.id = 'broken';

    app.stack = [{
      route: '',
      handle: session
    }];

    var session_fixed = connect.session({ secret: 'keyboard cat'});
    session_fixed.id = 'fixed';

    app = middleware.swapSession(app, session_fixed);

    assert.equal(app.stack[0].handle.id, 'fixed');
  });

});