import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, Length } from 'class-validator'
import { LanguageNames } from 'src/util/languages'

export class RegisterDto {
  @Length(1, 64)
  @ApiProperty()
  username: string

  @Length(1, 64)
  @ApiProperty()
  email: string

  @Length(1, 64)
  @ApiProperty()
  @IsMobilePhone()
  phoneNumber: string

  @Length(1, 64)
  @ApiProperty()
  password: string

  @ApiProperty()
  androidId: string

  @ApiProperty()
  fcmToken: string

  @ApiProperty({ enum: LanguageNames })
  language: LanguageNames
}
