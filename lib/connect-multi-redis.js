exports = module.exports = multipleRedisSessionStorageHandler;

exports.swapSession = swapSession;

exports.getNewWorkingConnection = getNewWorkingRedisConnection;

function swapSession(app, session) {
  // swapping the session middleware in the application middleware stack
  for (var i = 0, length = app.stack.length; i < length; i++) {
    if (app.stack[i].handle.name === 'session') {
      app.stack[i].handle = session;
      break;
    }
  }
  return app;
}

function getNewWorkingRedisConnection(redisConnections) {
  var connection = false;

  // trying to find a connected host
  for (var i = 0, length = redisConnections.length; i < length; i++) {
    if (redisConnections[i].client.connected) {
      connection = redisConnections[i];
      break;
    }
  }

  return connection;
};


function multipleRedisSessionStorageHandler(app, createSession, config) {

  return function multipleRedisSessionStorageHandler() {
    var usingMemoryStore = false,
        connection;

    if (config && config.hosts) {
      connection = config.hosts[0];
    }

    function multipleRedisSessionStorageMiddleware(req, res, next) {
      var swapped,
          session;

      // Everything is okay
      if (!usingMemoryStore && (connection && connection.client && connection.client.connected)) {
        return next();
      }

      // Try to get another working redis host
      connection = getNewWorkingRedisConnection(config.hosts);

      // If there is no config or a working connection,
      // initialize MemoryStore as the last fallback if we are not already using it, or
      // switch (back) to another redis host if we got a working connection
      if (!config || !connection) {

        if (usingMemoryStore) {
          return next();
        }

        session = createSession({ secret: config.session_secret, cookie: config.cookie });
        usingMemoryStore = true;
        swapped = true;
      } else {
        session = createSession({ store: connection, secret: config.session_secret, cookie: config.cookie });
        usingMemoryStore = false;
        swapped = true;
      }

      // place new session handler in the application stack
      if (swapped) {
        app = swapSession(app, session);
      }

      return next();
    }

    return multipleRedisSessionStorageMiddleware;

  };
};
