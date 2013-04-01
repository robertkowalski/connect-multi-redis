[![Build Status](https://travis-ci.org/robertkowalski/connect-multi-redis.png?branch=master)](https://travis-ci.org/robertkowalski/connect-multi-redis)

## connect-multi-redis

Manages multiple redis host fallbacks for sessions.

Once the connection to the current host fails, it choses another connected host, preventing the app from crashing.

If no redis hosts are connected it degrades to the builtin MemoryStore.

### Usage:

Place the middleware just after the cookieParser and before the session-middleware of Connect or Express

#### Connect:

```javascript

var connect = require('connect');
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

var multipleRedisSessions = require('connect-multi-redis')(app, connect.session, options);

app
  .use(connect.cookieParser())
  .use(multipleRedisSessions())
  .use(connect.session({ store: options.hosts[0], secret: options.session_secret }))
  .use(function(req, res) {
    res.end('Hello World');
  });

var server = http.createServer(app).listen(3000);

```

#### Express:

TBD