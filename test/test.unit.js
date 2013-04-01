var assert = require('chai').assert;
var middleware = require('../');

describe('getNewWorkingConnection', function(done) {

  it('should return a working redis host', function() {
    // stubbing...
    var redisConnections = [
      {
        client: {
          connected: false,
          id: 2
        }
      },
      {
        client: {
          connected: true,
          id: 3
        }
      }
    ];

    assert.equal(middleware.getNewWorkingConnection(redisConnections).client.id, 3);
  });

  it('should return false if no working host was found', function() {
    // stubbing...
    var redisConnections = [
      {
        client: {
          connected: false,
          id: 2
        }
      },
      {
        client: {
          connected: false,
          id: 3
        }
      }
    ];

    assert.deepEqual(middleware.getNewWorkingConnection(redisConnections), false);
  });

});

