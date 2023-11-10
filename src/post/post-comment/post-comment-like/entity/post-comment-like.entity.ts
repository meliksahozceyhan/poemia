import { BaseEntity } from 'src/sdk/entity/base.entity'
import { PostComment } from '../../entity/post-comment.entity'
import { User } from 'src/auth/user/entity/user.entity'
import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class PostCommentLike extends BaseEntity {
  @ManyToOne(() => PostComment, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'post_comment_id' })
  @ApiProperty({ type: PostComment, nullable: false, required: true })
  comment: PostComment

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User
}
