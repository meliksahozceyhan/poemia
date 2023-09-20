import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @ApiProperty({ required: false })
  username: string

  @ApiProperty({ required: false })
  email?: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @Length(6)
  password: string
}
