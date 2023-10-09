import { User } from '../entity/user.entity'
import { OmitType, PartialType } from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(
  OmitType(User, [
    'id',
    'createdAt',
    'updatedAt',
    'password',
    'username',
    'fcmToken',
    'featherType',
    'androidId',
    'isActive',
    'isPremium',
    'isVerified',
    'pCoin',
    'unlimitedPoem',
    'photoCheck',
    'phoneNumber',
    'email',
    'about',
    'labels'
  ])
) {}

//export class UpdateUserDto extends PartialType(OmitType(User, ['id', 'createdAt', 'updatedAt', 'password', 'username'])) {}
