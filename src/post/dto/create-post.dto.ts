import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Post } from '../entity/post.entity'
import { IsBoolean } from 'class-validator'

export class CreatePostDto extends PartialType(OmitType(Post, ['id', 'createdAt', 'isEditorsChoice', 'updatedAt', 'user', 'isHighlighted'])) {
  @IsBoolean()
  @ApiProperty({ required: true, default: false })
  isHighlighted: boolean
}
