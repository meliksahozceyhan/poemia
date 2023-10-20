import { OmitType } from '@nestjs/swagger'
import { CreateAboutDto } from './create-about-dto'

export class UpdateAboutDto extends OmitType(CreateAboutDto, ['user']) {}
