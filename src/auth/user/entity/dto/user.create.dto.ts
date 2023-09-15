import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import * as languages from 'src/util/languages'

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 64)
  @ApiProperty()
  email: string

  @IsNotEmpty()
  @ApiProperty()
  userName: string

  @IsNotEmpty()
  @ApiProperty()
  password: string

  @Length(0, 255)
  @ApiProperty()
  bio: string

  @ApiProperty()
  fcmToken: string

  @ApiProperty({ enum: languages })
  language: string

  @ApiProperty()
  androidId: string
}
