import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const transport = !isProduction
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    }
  : undefined; 

const logger = pino({
  level: isProduction ? 'info' : process.env.LOG_LEVEL,
  transport: transport,
});

export default logger;
