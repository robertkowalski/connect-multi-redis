var assert = require('chai').assert;
var connect = require('connect');
var middleware = require('../')(connect);
var request = require('supertest');
var http = require('http');
var RedisStore = require('connect-redis')(connect);

describe('Integration of the Middleware', function(done) {

  it('integrates in connect and handles the session host outage with the Memory Store', function(done){
    var app = connect()
      .use(connect.cookieParser())
      .use(middleware)
      .use(connect.session({
        secret: 'keyboard cat',
          store: new RedisStore({
          host: '127.0.0.1',
          port: 63793,
          maxAge: null
        })
      }))
      .use(function(req, res){
        req.session.count = 1;
        res.end(req.session.count.toString());
      });

    http.createServer(app).listen(3000);

    request(app)
      .get('/')
      .end(function(err, res) {
        assert.equal(res.text, '1');
        done();
      });
  });

});