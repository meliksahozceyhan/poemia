import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsObject, IsString } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { LanguageNames } from 'src/util/languages'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { StoryView } from '../story-view/entity/story-view.entity'

@Entity()
export class Story extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  @IsObject()
  user: User

  @Column({ type: 'timestamp with time zone' })
  @ApiProperty()
  @IsDate()
  expiresAt: Date

  @IsEnum(LanguageNames)
  @Column({ nullable: true, enum: LanguageNames })
  @ApiProperty({ enum: LanguageNames, nullable: true })
  @IsEnum(LanguageNames)
  language: LanguageNames

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  contentPath: string

  @OneToMany(() => StoryView, 'story')
  views: StoryView[]

  isViewed: boolean
}
