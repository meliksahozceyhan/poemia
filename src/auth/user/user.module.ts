import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UserAbout } from './entity/user-about.entity'
import { UserLabel } from './entity/user-label.entity'
import { JwtStrategy } from '../strategy/jwt.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAbout, UserLabel])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
