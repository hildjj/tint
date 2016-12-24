'use strict';

const Server = require('../src/server');
const bb = require('bluebird');
const net = require('net');
const test = require('ava');

test('create', t => {
  t.plan(2);
  t.throws(() => new Server());
  const s = new Server(() => {});
  return s.listen().then((port) => {
    t.true(typeof port === 'number');
    s.close();
  });
});

test('early write fail', t => {
  t.plan(1);
  const s = new Server(() => {});
  // this will fail when we close before writing
  t.throws(s.write('foo'));
  return s.listen().then((port) => {
    s.close();
  });
});

function client(port, send) {
  return new bb((res, rej) => {
    const data = [];
    const sock = net.connect(port, () => {
      if (send) {
        sock.write(send);
      }
    });
    sock.on('data', chunk => data.push(chunk));
    sock.on('error', rej);
    sock.on('close', () => res(Buffer.concat(data)));
  });
}

test('early write succeed', t => {
  t.plan(1);
  const s = new Server(buf => {
    s.write(buf).then(() => s.close());
  });
  s.write('foo');
  return s.listen().then((port) => {
    return client(port, 'bar');
  }).then((data) => {
    t.deepEqual(data, new Buffer('foobar'));
  });
});

test('write after close', t => {
  const s = new Server(() => {});
  s.close();
  t.throws(s.write('no'));
});

test('close twice', t => {
  const s = new Server(() => {});
  s.close();
  t.throws(() => s.close());
});