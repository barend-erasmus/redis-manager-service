// Imports
import * as path from 'path';
import * as winston from 'winston';

// Imports configuration
import { config } from './config';

let transportsArr = [];

transportsArr = [
  new (winston.transports.Console)({ level: 'debug' }),
  new (winston.transports.File)({
    filename: path.join(config.logging.path, 'redis-manager-api.log'),
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
      filename: path.join(config.logging.path, `redis-manager-api-${name}.log`),
      level: 'debug',
    }),
  ];

  return new (winston.Logger)({
    transports: transportsNameArr,
  });
}

// Exports
export { logger };
