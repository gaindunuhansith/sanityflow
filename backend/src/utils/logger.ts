import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import env from '../config/env.js';


const level = () => {
    const nodeEnv = env.NODE_ENV;
    const isDevelopment = nodeEnv === 'development';
    return isDevelopment ? 'debug' : 'warn';
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    ),
);

const transports: winston.transport[] = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
];

if (env.LOGTAIL_SOURCE_TOKEN) {
    const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN);
    transports.push(new LogtailTransport(logtail));
}

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

export default Logger;



