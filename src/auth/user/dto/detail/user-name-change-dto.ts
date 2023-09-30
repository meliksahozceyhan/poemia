import { ApiProperty } from '@nestjs/swagger'

export class UserNameChangeDto {
  @ApiProperty({ required: true })
  name: string
}
