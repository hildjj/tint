'use strict';

const path = require('path');
const utils = require('../src/utils');
const test = require('ava');

test('readJSON', t => {
  t.throws(utils.readJSON(path.join(__dirname, '..', 'DOES_not_EXIST.json')));
  return utils.readJSON(path.join(__dirname, '..', 'package.json'))
    .then((obj) => {
      t.truthy(obj);
      t.truthy(obj.version);
    });
});

test('required', t => {
  function foo({bar = utils.required('bar')}) {
    return bar;
  }
  t.is(foo({bar: 1}), 1);
  t.throws(() => foo());
  t.throws(() => foo({}));
  t.throws(() => foo({baz: 1}));
});