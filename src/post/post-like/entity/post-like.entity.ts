import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { Post } from 'src/post/entity/post.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'

@Entity()
@Unique(['post', 'user'])
export class PostLike extends BaseEntity {
  @ManyToOne(() => Post, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({ type: Post, nullable: false, required: true })
  post: Post

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User

  @Column({ default: false })
  @ApiProperty({ required: false, nullable: false, default: false })
  @IsBoolean()
  isSuper: boolean
}
