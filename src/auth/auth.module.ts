import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from './user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from './user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entity/user.entity'
import { UserAbout } from './user/entity/user-about.entity'
import { UserLabel } from './user/entity/user-label.entity'
import { ForgotPassword } from './entity/forgot-password.entity'
import { MailModule } from 'src/mail/mail.module'
import { UserView } from './user/entity/user-view.entity'
import { UserNameChange } from './user/entity/user-name-change.entity'
import { UserFollow } from './user/entity/user-follow.entity'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([User, UserAbout, UserLabel, UserView, UserNameChange, ForgotPassword, UserFollow]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('secrets.JWT'),
        signOptions: { expiresIn: '1y' }
      })
    })
  ]
})
export class AuthModule {}
