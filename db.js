const mongoose = require("mongoose"),
  connectionString = process.env.connectionString;

const connect = (url = connectionString, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};

module.exports = {
  connect
};
