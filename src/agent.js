'use strict';

const bb = require('bluebird');
const Server = require('./server');
const spawn = require('child_process').spawn;
const {required} = require('./utils');

let count = 0;
const _name = () => 'Case_' + count++;

module.exports = class Agent {
  constructor({args=[],
               name=_name(),
               onData=()=>{},
               shim=required('shim'),
               stdin}) {
    this.args = args;
    this.name = name;
    this.onData = onData;
    this.shim = shim;
    this.stdin = stdin;
    this.stdout = [];
    this.stderr = [];
    this.server = null;
  }

  run() {
    return (this.server = new Server(this.onData))
      .listen()
      .then((port) => {
        const args = this.args.slice(); // copy
        args.push(port.toString());
        this.child = spawn(this.shim, args);
        return new bb((res, rej) => {
          this.child.on('error', rej);
          this.child.stdout.on('data', (chunk) => this.stdout.push(chunk));
          this.child.stderr.on('data', (chunk) => this.stderr.push(chunk));
          this.child.on('exit', (code, sig) => {
            this.stdout = Buffer.concat(this.stdout);
            this.stderr = Buffer.concat(this.stderr);
            this.child = null;
            switch (code) {
              case 0:  return res();
              case 89: return res('Skipped');
              default:
                rej(new Error(
                  sig ?
                    `Agent ${this.name} failed with signal ${sig}` :
                    `Agent ${this.name} failed with code ${code}`
                ));
            }
          });
          if (this.stdin) {
            this.child.stdin.end(this.stdin);
          }
        });
      });
  }

  write(chunk, encoding) {
    if (!this.child) {
      return bb.reject(new Error('Invalid state.  No child process'));
    }
    return this.server.write(chunk, encoding);
  }

  close() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
  kill() {
    if (this.child) {
      this.child.kill('SIGKILL');
    }
  }
};

