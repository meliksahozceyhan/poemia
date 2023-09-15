import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

export class RegisterDto {
  @Length(1, 64)
  @ApiProperty()
  username: string

  @Length(1, 64)
  @ApiProperty()
  email: string

  @Length(1, 64)
  @ApiProperty()
  password: string

  @ApiProperty()
  androidId: string

  @ApiProperty()
  fcmToken: string
}
