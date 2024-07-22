import { IsEnum } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { ContestStatus } from '../enum/contest-status.enum'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { ContestTopic } from '../enum/contest-topic.enum'
import { ContestPost } from './contest-post.entity'

@Entity()
export class Contest extends BaseEntity {
  @IsEnum(ContestStatus)
  @Column({ nullable: false, enum: ContestStatus })
  @ApiProperty({ enum: ContestStatus, nullable: true })
  contestStatus: ContestStatus

  @IsEnum(ContestTopic)
  @Column({ nullable: false, enum: ContestTopic })
  @ApiProperty({ enum: ContestTopic, nullable: true })
  contestTopic: ContestTopic

  @OneToMany(() => ContestPost, 'contest')
  @ApiHideProperty()
  contestPosts: ContestPost
}
