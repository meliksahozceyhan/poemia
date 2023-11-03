import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Story } from 'src/story/entity/story.entity'
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'

@Entity()
@Unique(['user', 'story'])
export class StoryView extends BaseEntity {
  @ManyToOne(() => Story, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'story_id' })
  @ApiProperty({ type: Story, nullable: false, required: true })
  story: Story

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User
}
