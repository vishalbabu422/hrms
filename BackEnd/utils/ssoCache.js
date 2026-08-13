const NodeCache = require("node-cache");

module.exports = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60,
});
