import { ApiProperty } from '@nestjs/swagger'
import { IsDate } from 'class-validator'
import { Post } from 'src/post/entity/post.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class PostHighlight extends BaseEntity {
  @ManyToOne(() => Post, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({ type: Post, nullable: false, required: true })
  post: Post

  @Column({ type: 'timestamp with time zone' })
  @ApiProperty()
  @IsDate()
  expiresAt: Date
}
