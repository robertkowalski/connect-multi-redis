module.exports = process.env.TEST_COV
  ? require('./lib-cov/connect-multiple-redis')
  : require('./lib/connect-multiple-redis');