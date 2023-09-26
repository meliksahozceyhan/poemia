import { PartialType } from '@nestjs/swagger'
import { User } from '../entity/user.entity'

export class UpdateUserDto extends PartialType(User) {}
