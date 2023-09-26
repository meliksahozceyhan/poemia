import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './config/database.config'
import secretConfig from './config/secret.config'
import { DatabaseModule } from './database/database.module'
import { WinstonLoggerModule } from './winston-logger/winston-logger.module'
import { LoggingInterceptor } from './interceptors/logger.interceptor'
import { AuthModule } from './auth/auth.module'
import { ApiModule } from './api/api.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { MailModule } from './mail/mail.module'
import { FileModule } from './file/file.module'
import mailConfig from './config/mail.config'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig, secretConfig, mailConfig], isGlobal: true }),
    DatabaseModule,
    WinstonLoggerModule,
    AuthModule,
    ApiModule,
    MailModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
