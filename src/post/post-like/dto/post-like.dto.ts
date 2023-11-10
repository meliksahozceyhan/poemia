import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class PostLikeDto {
  @ApiProperty({ required: true, default: false, nullable: false })
  @IsBoolean()
  isSuper: boolean
}
