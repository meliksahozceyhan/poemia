import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsObject } from 'class-validator'
import { PostComment } from '../entity/post-comment.entity'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'

export class PostCommentCreateDto extends PartialType(OmitType(PostComment, ['id', 'createdAt', 'updatedAt', 'post', 'mention', 'user', 'post'])) {
  @ApiProperty({ type: UserReferenceDto })
  @IsObject()
  mention?: UserReferenceDto
}
