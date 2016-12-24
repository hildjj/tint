'use strict';

const utils = require('./utils');
const Agent = require('./agent');
const path = require('path');

let count = 0;
const _name = () => 'Case_' + count++;

module.exports = class Case {
  constructor(argv, {name=_name(), server={}, client={}, keyBase='rsa_1024'}) {
    this.name = name;
    let serverArgs = [
      '-server',
      '-key-file',
      path.join(argv.dir, `${keyBase}_key.pem`),
      '-cert-file',
      path.join(argv.dir, `${keyBase}_cert.pem`),
      '-write-then-read'
    ];
    if (server.flags) {
      serverArgs = serverArgs.concat(server.flags);
    }
    serverArgs.push('-port');

    this.server = new Agent({
      name: `${this.name} server`,
      shim: argv.server,
      args: serverArgs
    });

    const clientArgs = client.flags || [];
    clientArgs.push('-port');

    this.client = new Agent({
      name: `${this.name} client`,
      shim: argv.client,
      args: clientArgs
    });
  }
  run() {
    this.server.run();
  }
};