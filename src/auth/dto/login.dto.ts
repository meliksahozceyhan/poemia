import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  username: string

  @ApiProperty({ required: false })
  @IsEmail()
  email?: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @Length(6)
  password: string
}
