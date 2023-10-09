import { PartialType } from '@nestjs/swagger'

import { UserAbout } from '../../entity/user-about.entity'

export class CreateAboutDto extends PartialType(UserAbout) {}
