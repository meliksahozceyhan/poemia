import { PartialType } from '@nestjs/swagger'
import { Post } from '../entity/post.entity'

export class CreatePostDto extends PartialType(Post) {}
