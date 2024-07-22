import { ClassSerializerInterceptor, Module } from '@nestjs/common'
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
import { PostModule } from './post/post.module'
import { QueueModule } from './queue/queue.module'
import { BullImplModule } from './bull-impl/bull-impl.module'
import { StoryModule } from './story/story.module'
import { ChatModule } from './chat/chat.module'
import { ContestModule } from './contest/contest.module'
import mailConfig from './config/mail.config'
import queueConfig from './config/queue.config'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig, secretConfig, mailConfig, queueConfig], isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    WinstonLoggerModule,
    AuthModule,
    ApiModule,
    MailModule,
    FileModule,
    PostModule,
    QueueModule,
    BullImplModule,
    StoryModule,
    ChatModule,
    ContestModule
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
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
