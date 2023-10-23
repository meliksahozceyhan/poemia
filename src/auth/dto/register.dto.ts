import { PickType } from '@nestjs/swagger'
import { User } from '../user/entity/user.entity'

export class RegisterDto extends PickType(User, ['username', 'email', 'phoneNumber', 'password', 'androidId', 'fcmToken', 'language']) {}
