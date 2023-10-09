import { ApiProperty } from '@nestjs/swagger'

export class PostLikeDto {
  @ApiProperty({ required: true, default: false, nullable: false })
  isSuper: boolean
}
