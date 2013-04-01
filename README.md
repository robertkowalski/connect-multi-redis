[![Build Status](https://travis-ci.org/robertkowalski/connect-multi-redis.png?branch=master)](https://travis-ci.org/robertkowalski/connect-multi-redis)

## connect-multi-redis

Manages multiple redis host fallbacks for sessions.

Once the connection to the current host fails, it choses another connected host, preventing the app from crashing.

If no redis hosts are connected it degrades to the builtin MemoryStore.

### Usage:

Place the middleware before the session-middleware of Connect or Express

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

```javascript

var app = require('express');
var http = require('http');
var RedisStore = require('connect-redis')(express);

var options = {
  hosts: [
    new RedisStore({
      host: '127.0.0.1',
      port: 63793,
      maxAge: null
    }),
    new RedisStore({
      host: '127.0.0.1',
      port: 6379,
      maxAge: null
    }),
  ],
  session_secret: 'foo',
  cookie: {
    maxAge: null
  }
};

var multipleRedisSessions = require('connect-multi-redis')(app, express.session, options);

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(env.COOKIE_SECRET || 'lolcat'));
  app.use(multiRedis());
  app.use(express.session({store: options.hosts[0], secret: env.SESSION_SECRET || 'lolcat'}));
  app.use(app.router);
});

app.get('/', function(req, res){
  res.send('hello world');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

```