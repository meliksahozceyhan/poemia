import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class RefreshDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  refreshToken: string
}
