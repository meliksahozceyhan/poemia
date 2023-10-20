import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'

import { UserAbout } from '../../entity/user-about.entity'
import { UserReferenceDto } from '../user-reference-dto'
import { IsNotEmptyObject } from 'class-validator'

export class CreateAboutDto extends PartialType(OmitType(UserAbout, ['id', 'createdAt', 'updatedAt', 'user'])) {
  @ApiProperty()
  @IsNotEmptyObject()
  user: UserReferenceDto
}
