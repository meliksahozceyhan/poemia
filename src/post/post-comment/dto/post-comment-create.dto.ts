import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { PostComment } from '../entity/post-comment.entity'

export class PostCommentCreateDto {
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({ type: String, nullable: false, required: true, maxLength: 255, minLength: 1 })
  content: string

  @ApiProperty({ type: PostComment, nullable: true, required: false })
  comment: PostComment
}
