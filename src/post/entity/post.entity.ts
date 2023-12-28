import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, Length } from 'class-validator'
import { User } from 'src/auth/user/entity/user.entity'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { PostTypes } from 'src/util/enums'
import { LanguageNames } from 'src/util/languages'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { PostHighlight } from '../post-highlight/entity/post-highlight.entity'
import { PostLike } from '../post-like/entity/post-like.entity'
import { PostRepost } from '../post-repost/entity/post-repost.entity'
import { PostView } from '../post-view/entity/post-view.entity'
import { PostComment } from '../post-comment/entity/post-comment.entity'
import { UserReferenceDto } from 'src/auth/user/dto/user-reference-dto'

@Entity()
export class Post extends BaseEntity {
  @IsString()
  @Length(0, 64)
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

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  videoPath: string

  @Column({ default: false })
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

  @Column({ type: 'simple-array', nullable: true })
  @IsArray()
  tags: string[]

  @ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true })
  @JoinTable({ name: 'post_user' })
  @IsArray()
  @ApiProperty({ type: [UserReferenceDto] })
  taggedUsers: User[]

  @OneToMany(() => PostView, 'post')
  @ApiHideProperty()
  views: PostView[]

  @OneToMany(() => PostLike, 'post')
  @ApiHideProperty()
  likes: PostLike[]

  @OneToMany(() => PostComment, 'post')
  @ApiHideProperty()
  comments: PostComment[]

  @OneToMany(() => PostHighlight, 'post')
  @ApiHideProperty()
  highlights: PostHighlight[]

  @OneToMany(() => PostRepost, 'post')
  @ApiHideProperty()
  reposts: PostRepost[]

  likeCount: number

  superLikeCount: number
  isHighlighted: PostHighlight
  isLiked: PostLike
  isRepoemed: PostRepost

  viewCount: number

  repostCount: number

  commentCount: number

  weeklyLike: number

  lastLike: PostLike
  lastComment: PostComment
}
