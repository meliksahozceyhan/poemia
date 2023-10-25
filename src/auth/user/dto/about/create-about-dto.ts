import { OmitType, PartialType } from '@nestjs/swagger'

import { UserAbout } from '../../entity/user-about.entity'

export class CreateAboutDto extends PartialType(OmitType(UserAbout, ['id', 'createdAt', 'updatedAt', 'user'])) {}
