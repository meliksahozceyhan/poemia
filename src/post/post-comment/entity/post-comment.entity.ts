import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { Post } from 'src/post/entity/post.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class PostComment extends BaseEntity {
  @ManyToOne(() => Post, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({ type: Post, nullable: false, required: true })
  post: Post

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User

  @ManyToOne(() => PostComment, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'comment_id' })
  @ApiProperty({ type: PostComment, nullable: true, required: true })
  commentTo: PostComment

  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({ type: String, nullable: false, required: true, maxLength: 255, minLength: 1 })
  @Column({ length: 255 })
  content: string
}
