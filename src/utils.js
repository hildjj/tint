'use strict';

const bb = require('bluebird');
const fs = bb.promisifyAll(require('fs'));

/// Read JSON and parse file, return promise
exports.readJSON = function(file) {
  return fs.readFileAsync(file).then((buf) => {
    return JSON.parse(buf);
  });
};

/// Extract just the given fields from an object.
/// Deals with invald objects and fields by returning an empty object.
exports.filter = function(obj, fields) {
  const res = {};
  if (obj && (typeof(obj) === 'object') && Array.isArray(fields)) {
    for (const f of fields) {
      if (obj.hasOwnProperty(f)) {
        res[f] = obj[f];
      }
    }
  }
  return res;
};

exports.Configurable = class Configurable {
  constructor(opts, fields) {
    Object.assign(this, exports.filter(opts, fields));
  }
};