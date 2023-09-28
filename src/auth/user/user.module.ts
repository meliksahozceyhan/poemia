import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UserAbout } from './entity/user-about.entity'
import { UserLabel } from './entity/user-label.entity'
import { JwtStrategy } from '../strategy/jwt.strategy'
import { UserView } from './entity/user-view.entity'
import { UserFollow } from './entity/user-follow.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAbout, UserLabel, UserView, UserFollow])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
