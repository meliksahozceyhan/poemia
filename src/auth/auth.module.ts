import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from './user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from './user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entity/user.entity'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
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
