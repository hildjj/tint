'use strict';

const Agent = require('../src/agent');
const test = require('ava');

test('create', t => {
  t.throws(() => new Agent());
  t.throws(() => new Agent({}));
  const a = new Agent({
    shim: 'echo'
  });
  return a.run().then((succ) => {
    t.is(succ, undefined);
    t.regex(a.stdout.toString(), /^\d+\n$/);
  });
});

test('stderr', t => {
  t.plan(1);
  const a = new Agent({
    shim: 'node',
    args: ['-e', 'process.stderr.write(process.argv[1])']
  });
  return a.run().then((succ) => {
    t.regex(a.stderr.toString(), /^\d+$/);
  });
});

test('stdin', t => {
  t.plan(2);
  const a = new Agent({
    shim: 'cat',
    args: ['-'],
    stdin: 'foo'
  });
  return a.run().catch(() => {
    // errors because of port being added, which is not a filename
    t.is(a.stdout.toString(), 'foo');
    t.truthy(a.stderr.length > 0);
  });
});

test('exit skipped', t => {
  const a = new Agent({
    shim: 'node',
    args: ['-e', 'process.exit(89)']
  });
  return a.run().then(succ => {
    t.is(succ, 'Skipped');
  });
});

test('kill no-op', t => {
  t.plan(1);
  const a = new Agent({
    shim: 'echo'
  });
  return a.run().then((succ) => {
    t.is(succ, undefined);
    a.kill();
  });
});

test.cb('kill', t => {
  t.plan(1);
  const a = new Agent({
    shim: 'node'
  });
  a.run().catch((er) => {
    t.regex(er.message, /SIGKILL/);
    t.end();
  });
  setImmediate(() => {
    a.kill();
  });
});

test('write fail', t => {
  const a = new Agent({
    shim: 'echo'
  });
  t.throws(a.write('foo'));
});

test('write', t => {
  const a = new Agent({
    shim: 'nc',
    args: ['localhost'],
    stdin: 'foo'
  });
  const ret = a.run();
  setImmediate(() => {
    a.write('bar').then(() => a.close());
  });
  return ret;
});

test('early close', t => {
  const a = new Agent({
    shim: 'echo'
  });
  a.close();
});