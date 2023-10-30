import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, Length } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { PostTypes } from 'src/util/enums'
import { LanguageNames } from 'src/util/languages'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class Post extends BaseEntity {
  @IsString()
  @Length(1, 64)
  @Column({ length: 64, nullable: true })
  @ApiProperty({ nullable: true, type: 'string', maximum: 64 })
  title: string

  @IsString()
  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true, type: 'text' })
  content: string

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true })
  @IsString()
  contentHtml: string

  @IsNotEmpty()
  @IsEnum(PostTypes)
  @Column({ type: 'enum', enum: PostTypes })
  @ApiProperty({ required: true, enum: PostTypes })
  postType: PostTypes

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User, nullable: false, required: true })
  @IsObject()
  user: User

  @IsEnum(LanguageNames)
  @Column({ nullable: true, enum: LanguageNames })
  @ApiProperty({ enum: LanguageNames, nullable: true })
  @IsEnum(LanguageNames)
  language: LanguageNames

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  imagePath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  voicePath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  walpaperPath: string

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  readerVideoPath: string

  @Column({ default: true })
  @ApiProperty({ default: true })
  @IsBoolean()
  isDraft: boolean

  @Column({ default: false })
  @ApiProperty({ default: false })
  @IsBoolean()
  isEditorsChoice: boolean

  @Column({ default: false })
  @ApiProperty({ default: false })
  @IsBoolean()
  copyRight: boolean
}
