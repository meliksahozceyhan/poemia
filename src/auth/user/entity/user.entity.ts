import { ApiProperty } from '@nestjs/swagger'
import { Exclude, instanceToPlain } from 'class-transformer'
import { IsEnum, IsNotEmpty, Length } from 'class-validator'
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
  fcmToken: string

  @IsEnum(LanguageNames)
  @Column({ nullable: true, enum: LanguageNames })
  @ApiProperty({ enum: LanguageNames, nullable: true })
  language: LanguageNames

  @IsEnum(FeatherType)
  @Column({ nullable: true, enum: FeatherType })
  @ApiProperty({ enum: FeatherType, nullable: false, default: FeatherType.POET_CANDIDATE })
  featherType: FeatherType.POET_CANDIDATE

  @Column({ default: false })
  @ApiProperty()
  unlimitedPoem: boolean

  @Column()
  @ApiProperty()
  androidId: string

  @Column({ default: false })
  @ApiProperty()
  isPremium: boolean

  @Column({ default: 0 })
  @ApiProperty()
  pCoin: number

  @Column({ default: true })
  @ApiProperty()
  isPrivate: boolean

  @Column({ default: true })
  @ApiProperty()
  isViewPrivate: boolean

  @Column({ default: true })
  @ApiProperty()
  photoCheck: boolean

  @Column({ default: false })
  @ApiProperty()
  isActive: boolean

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  profileImageUrl: string

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  coverPhotoUrl: string

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true })
  detail: string

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ nullable: true })
  interest: string

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
