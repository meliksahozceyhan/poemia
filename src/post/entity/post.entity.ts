import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, Length } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { PostTypes } from 'src/util/enums'
import { LanguageNames } from 'src/util/languages'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class Post extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @Column({ length: 64, nullable: true })
  @ApiProperty({ nullable: true, type: 'string', maximum: 64 })
  title: string

  @IsNotEmpty()
  @Length(1, 255)
  @Column({ length: 255 })
  @ApiProperty({ nullable: true, type: 'string', maximum: 255 })
  content: string

  @IsNotEmpty()
  @IsEnum(PostTypes)
  @Column({ enum: PostTypes })
  @ApiProperty({ required: true, enum: PostTypes })
  postType: PostTypes

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  user: User

  @IsEnum(LanguageNames)
  @Column({ nullable: true, enum: LanguageNames })
  @ApiProperty({ enum: LanguageNames, nullable: true })
  language: LanguageNames

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  imagePath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  voicePath: string

  //TODO: Add Emotion Status.

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  walpaperPath: string

  @Column({ default: true })
  @ApiProperty({ default: true })
  isDraft: boolean

  @Column({ default: false })
  @ApiProperty({ default: false })
  isEditorsChoice: boolean
}
