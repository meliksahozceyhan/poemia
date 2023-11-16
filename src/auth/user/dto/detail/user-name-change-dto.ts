import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class UserNameChangeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username must contain only letters numbers and _ '
  })
  name: string
}
