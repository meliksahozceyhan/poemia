import { PickType } from '@nestjs/swagger'
import { Post } from '../entity/post.entity'

export class PostReferenceDto extends PickType(Post, ['id']) {}
