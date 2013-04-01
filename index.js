module.exports = process.env.TEST_COV
  ? require('./lib-cov/connect-multi-redis')
  : require('./lib/connect-multi-redis');