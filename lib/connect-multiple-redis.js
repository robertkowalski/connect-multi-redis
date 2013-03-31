exports = module.exports = multipleRedisSessionStorageHandler;

exports.swapSessionMiddleware = swapSessionMiddleware;

exports.middleware = middleware;

function swapSessionMiddleware(stack) {

}

function middleware(req, res, next) {
  next();
}


function multipleRedisSessionStorageHandler(connect) {



  return middleware;

    //req.app.stack
};

