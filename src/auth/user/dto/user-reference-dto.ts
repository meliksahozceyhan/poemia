import { PickType } from '@nestjs/swagger'
import { User } from '../entity/user.entity'

export class UserReferenceDto extends PickType(User, ['id']) {}
