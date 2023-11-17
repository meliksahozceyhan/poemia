import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UserAbout } from './entity/user-about.entity'
import { UserView } from './entity/user-view.entity'
import { UserFollow } from './entity/user-follow.entity'
import { UserNameChange } from './entity/user-name-change.entity'
import { UserActionService } from './user-actions.service'
import { UserBlocked } from './entity/user-blocked.entity'
import { BullModule } from '@nestjs/bull'
import { UserBadge } from './entity/user-badge.entity'
import { StoryModule } from 'src/story/story.module'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'view' }),
    TypeOrmModule.forFeature([User, UserAbout, UserView, UserFollow, UserNameChange, UserBlocked, UserBadge]),
    StoryModule
  ],
  controllers: [UserController],
  providers: [UserService, UserActionService],
  exports: [UserService]
})
export class UserModule {}
