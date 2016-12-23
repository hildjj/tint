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

test('filter', t => {
  t.deepEqual(utils.filter(), {});
  t.deepEqual(utils.filter(true), {});
  t.deepEqual(utils.filter(false), {});
  t.deepEqual(utils.filter(0), {});
  t.deepEqual(utils.filter(1), {});
  t.deepEqual(utils.filter({}), {});
  t.deepEqual(utils.filter({f: 1}), {});
  t.deepEqual(utils.filter({f: 1}, []), {});
  t.deepEqual(utils.filter({f: 1}, ['g']), {});
  t.deepEqual(utils.filter({f: 1, g: 2}, ['g']), {g: 2});
});

test('Configurable', t => {
  class Foo extends utils.Configurable {
    constructor(obj) {
      super(obj, ['foo']);
    }
  }
  let f = new Foo({one: 1});
  t.truthy(f);
  t.falsy(f.foo);
  t.falsy(f.one);
  f = new Foo({foo: 1});
  t.truthy(f);
  t.truthy(f.foo);
});