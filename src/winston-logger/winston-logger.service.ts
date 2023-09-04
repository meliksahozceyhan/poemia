import { LoggerService } from '@nestjs/common'
import { createLogger, transports, format, Logger } from 'winston'

import 'winston-mongodb'

const { combine, timestamp, json } = format

const CATEGORY = process.env.APP_NAME

// const customFormat = printf(({ level, message, label, timestamp }) => {
//   return ` ${level}: ${label} ${message} [${timestamp}]`
// })

export class WinstonLoggerService implements LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      format: json(),
      transports: [
        new transports.MongoDB({
          db: process.env.MONGO_URI,
          dbName: 'log',
          format: combine(timestamp(), json(), format.metadata()),
          level: 'info',
          label: CATEGORY,
          storeHost: true,
          options: {
            useUnifiedTopology: true
          }
        })
        // new transports.Console({
        //   level: 'info',
        //   format: combine(
        //     label({ label: CATEGORY }),
        //     timestamp(),
        //     customFormat,
        //     colorize({ all: true, colors: { info: 'yellow' } }),
        //     format.metadata({ key: 'metadata' })
        //   )
        // })
      ]
    })
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log('info', message, ...optionalParams)
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.log('error', message, ...optionalParams)
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.log('warn', message, ...optionalParams)
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.log('debug', message, ...optionalParams)
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.log('verbose', message, ...optionalParams)
  }
}
