import { ApiProperty } from '@nestjs/swagger'
import { IsMobilePhone, Length } from 'class-validator'

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

  @ApiProperty()
  language: string
}
