'use strict';

const bb = require('bluebird');
const fs = bb.promisifyAll(require('fs'));

/// Read JSON and parse file, return promise
exports.readJSON = function(file) {
  return fs.readFileAsync(file).then((buf) => {
    return JSON.parse(buf);
  });
};

exports.required = function(name) {
  throw new Error(`parameter "${name}" required`);
};
