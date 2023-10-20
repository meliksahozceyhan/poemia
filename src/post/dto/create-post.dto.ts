import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Post } from '../entity/post.entity'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'
import { IsNotEmptyObject } from 'class-validator'

export class CreatePostDto extends PartialType(OmitType(Post, ['id', 'createdAt', 'isEditorsChoice', 'updatedAt', 'user'])) {
  @ApiProperty()
  @IsNotEmptyObject()
  user: UserReferenceDto
}
