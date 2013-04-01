var assert = require('chai').assert;
var connect = require('connect');
var request = require('supertest');
var http = require('http');
var RedisStore = require('connect-redis')(connect);

var options = {
  hosts: [
    new RedisStore({
      host: '127.0.0.1',
      port: 63793,
      maxAge: null
    }),
    new RedisStore({
      host: '127.0.0.1',
      port: 63793,
      maxAge: null
    }),
  ],
  session_secret: 'foo',
  cookie: {
    maxAge: null
  }
};

var app = connect();

describe('Middleware', function(done) {

  it('integrates in connect and handles the session host outage with the MemoryStore', function(done) {
    var middleware = require('../')(app, connect.session, options);

    app
      .use(connect.cookieParser())
      .use(middleware())
      .use(connect.session({ store: options.hosts[0], secret: options.session_secret }))
      .use(function(req, res) {
        req.session.count = 1;
        res.end(req.session.count.toString());
      });

    var server = http.createServer(app).listen(3000);

    request(app)
      .get('/')
      .end(function(err, res) {
        assert.equal(res.text, '1');
        server.close();
        done();
      });
  });

  it('integrates in connect and works without a config', function(done) {
    var middleware = require('../')(app, connect.session, undefined);

    app
      .use(connect.cookieParser())
      .use(middleware())
      .use(connect.session({ store: options.hosts[0], secret: options.session_secret }))
      .use(function(req, res) {
        req.session.count = 1;
        res.end(req.session.count.toString());
      });

    var server = http.createServer(app).listen(3000);

    request(app)
      .get('/')
      .end(function(err, res) {
        assert.equal(res.text, '1');
        server.close();
        done();
      });
  });
});