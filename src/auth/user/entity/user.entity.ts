import { ApiProperty } from '@nestjs/swagger'
import { Exclude, instanceToPlain } from 'class-transformer'
import { Allow, IsEnum, IsNotEmpty, Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, OneToOne } from 'typeorm'
import { LanguageNames } from 'src/util/languages'
import { UserAbout } from './user-about.entity'
import { FeatherType } from 'src/util/enums'

@Entity()
export class User extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @Column({ length: 64, nullable: false, unique: true })
  email: string

  @IsNotEmpty()
  @Column({ nullable: false, unique: true })
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  @ApiProperty()
  password: string

  @IsNotEmpty()
  @Column({ nullable: false, unique: true })
  @ApiProperty()
  phoneNumber: string

  @Length(0, 255)
  @Column({ length: 255, nullable: true })
  @ApiProperty({ nullable: true })
  bio: string

  @Length(0, 255)
  @Column({ length: 255, nullable: true })
  @ApiProperty({ nullable: true })
  nameSurname: string

  @Column()
  @ApiProperty()
  @Allow()
  fcmToken: string

  @IsEnum(LanguageNames)
  @Column({ type: 'enum', nullable: true, enum: LanguageNames })
  @ApiProperty({ type: 'enum', enum: LanguageNames })
  language: LanguageNames

  @IsEnum(FeatherType)
  @Column({ type: 'enum', nullable: true, enum: FeatherType, default: FeatherType.POET_CANDIDATE })
  @ApiProperty({ enum: FeatherType, default: FeatherType.POET_CANDIDATE })
  featherType: FeatherType.POET_CANDIDATE

  @Column({ default: false })
  @ApiProperty()
  @Allow()
  unlimitedPoem: boolean

  @Column()
  @ApiProperty()
  @Allow()
  androidId: string

  @Column({ default: false })
  @ApiProperty()
  @Allow()
  isPremium: boolean

  @Column({ default: 0 })
  @ApiProperty()
  @Allow()
  pCoin: number

  @Column({ default: true })
  @ApiProperty()
  @Allow()
  isPrivate: boolean

  @Column({ default: true })
  @ApiProperty()
  @Allow()
  isViewPrivate: boolean

  @Column({ default: true })
  @ApiProperty()
  @Allow()
  photoCheck: boolean

  @Column({ default: false })
  @ApiProperty()
  @Allow()
  isActive: boolean

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @Allow()
  profileImageUrl: string

  @Column({ default: false })
  @ApiProperty()
  @Allow()
  isVerified: boolean

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @Allow()
  coverPhotoUrl: string

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true })
  @Allow()
  detail: string

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true })
  @Allow()
  interest: string

  @Column({ nullable: false, type: 'int', default: 0 })
  @ApiProperty({ nullable: false })
  userPoint: number

  @OneToOne(() => UserAbout, (userAbout) => userAbout.user, { eager: true, cascade: true })
  @ApiProperty({ type: UserAbout, nullable: true })
  about: UserAbout

  /* @OneToMany(() => UserLabel, (userLabel) => userLabel.user, { eager: true })
  @ApiProperty({ type: [UserLabel], nullable: true })
  labels: UserLabel[] */

  toJSON() {
    return instanceToPlain(this)
  }
}
