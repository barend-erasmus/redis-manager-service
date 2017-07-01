// Imports
import * as path from 'path';
import * as winston from 'winston';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
    config = require('./config.prod').config;
}


let transportsArr = [];

transportsArr = [
  new (winston.transports.Console)({ level: 'debug' }),
  new (winston.transports.File)({
    filename: path.join(config.logging.path, 'redis-manager-service.log'),
    level: 'debug',
  }),
];

const logger = new (winston.Logger)({
  transports: transportsArr,
});

export function getLogger(name: string) {

  let transportsNameArr = [];

  transportsNameArr = [
    new (winston.transports.Console)({ level: 'debug' }),
    new (winston.transports.File)({
      filename: path.join(config.logging.path, `redis-manager-service-${name}.log`),
      level: 'debug',
    }),
  ];

  return new (winston.Logger)({
    transports: transportsNameArr,
  });
}

// Exports
export { logger };
