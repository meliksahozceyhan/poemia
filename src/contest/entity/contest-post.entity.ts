import { ApiProperty } from '@nestjs/swagger'
import { IsObject } from 'class-validator'
import { Post } from 'src/post/entity/post.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { Contest } from './contest.entity'

@Entity()
export class ContestPost extends BaseEntity {
  @OneToOne(() => Post, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({ type: Post, nullable: false, required: true })
  @IsObject()
  post: Post

  @ManyToOne(() => Contest, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'contest_id' })
  @ApiProperty({ type: Contest, nullable: false, required: true })
  @IsObject()
  contest: Contest

  @Column({ nullable: false, default: 0 })
  @ApiProperty({ required: true, readOnly: true, nullable: false })
  point: number

  @Column({ nullable: true })
  @ApiProperty({ description: 'When a contest is finished The Top 10 Posts of that competition will receive this field as their final standing.' })
  finalStanding: number
}
