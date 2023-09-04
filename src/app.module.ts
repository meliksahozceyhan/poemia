import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './config/database.config'
import secretConfig from './config/secret.config'
import { DatabaseModule } from './database/database.module'
import { WinstonLoggerModule } from './winston-logger/winston-logger.module'
import { LoggingInterceptor } from './interceptors/logger.interceptor'

@Module({
  imports: [ConfigModule.forRoot({ load: [databaseConfig, secretConfig], isGlobal: true }), DatabaseModule, WinstonLoggerModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
