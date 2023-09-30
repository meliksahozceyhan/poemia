import { PickType } from '@nestjs/swagger'
import { User } from '../entity/user.entity'

export class FcmTokenUpdateDto extends PickType(User, ['fcmToken']) {}
