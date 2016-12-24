'use strict';

const bb = require('bluebird');
const net = require('net');

/// A promisified socket server that only allows a single client
/// before stopping listening, always uses a random port, and allows
/// I/O to the single client easily.
module.exports = class Server {
  // TODO: figure out how to make the error event reject listen()
  constructor(onData) {
    if (typeof onData !== 'function') {
      throw new Error('onData function required');
    }
    this.onData = onData;
    this.client = null;
    this.buf = [];
    this.server = net.createServer();
    this.server.once('connection', (cli) => {
      cli.on('data', this.onData);
      this.server.close();
      this.server = null;
      this.client = cli;
      for (const buf of this.buf) {
        cli.write(buf.chunk, buf.encoding, () => buf.res());
      }
    });
  }
  listen() {
    return bb.fromCallback((cb) => this.server.listen(cb))
      .then(() => this.server.address().port);
  }
  get isConnected() {
    return this.client !== null;
  }
  write(chunk, encoding) {
    if (!this.isConnected) {
      if (!this.server) {
        return bb.reject(new Error('Write after close'));
      }
      return new bb((res, rej) => {
        this.buf.push({
          chunk: chunk,
          encoding: encoding,
          res: res,
          rej: rej
        });
      });
    } else {
      return bb.fromCallback((cb) => this.client.write(chunk, cb));
    }
  }
  close() {
    if (this.server) {
      this.server.close();
      this.server = null;
      for (const buf of this.buf) {
        buf.rej(new Error('Closed before writing'));
      }
      this.buf = [];
    } else if (this.isConnected) {
      this.client.end();
      this.client = null;
    } else {
      throw new Error('Cannot close twice');
    }
  }
};