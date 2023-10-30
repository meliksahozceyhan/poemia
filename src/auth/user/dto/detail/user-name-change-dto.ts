import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UserNameChangeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string
}
