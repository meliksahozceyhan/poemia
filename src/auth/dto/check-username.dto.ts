import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CheckUsernameDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string
}
