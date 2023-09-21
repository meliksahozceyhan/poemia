import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, instanceToPlain } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { languageNames } from 'src/util/languages'
import { UserAbout } from './user-about.entity'
import { UserLabel } from './user-label.entity'

@Entity()
export class User extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @Column({ length: 64, nullable: false, unique: true })
  email: string

  @IsNotEmpty()
  @Column({ nullable: false, unique: true })
  username: string

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string

  @IsNotEmpty()
  @Column({ nullable: false, unique: true })
  phoneNumber: string

  @Length(0, 255)
  @Column({ length: 255, nullable: true })
  bio: string

  @Column()
  fcmToken: string

  @Column({ length: 2, nullable: true })
  @ApiProperty({ enum: languageNames })
  language: string

  @Column({ default: false })
  unlimitedPoem: boolean

  @Column()
  androidId: string

  @Column({ default: false })
  isPremium: boolean

  @Column({ default: 0 })
  pCoin: number

  @Column({ default: false })
  isPrivate: boolean

  @Column({ default: false })
  isViewPrivate: boolean

  @Column({ default: false })
  photoCheck: boolean

  @Column({ default: false })
  isActive: boolean

  @OneToOne(() => UserAbout, (userAbout) => userAbout.user, { eager: true, cascade: true })
  about: UserAbout

  @OneToMany(() => UserLabel, (userLabel) => userLabel.user, { eager: true, cascade: true })
  @Transform(({ value }) => value.label)
  labels: UserLabel[]

  toJSON() {
    return instanceToPlain(this)
  }
}
