import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, instanceToPlain } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base-entity'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { languageNames } from 'src/util/languages'
import { UserAbout } from './user-about.entity'
import { UserLabel } from './user-label.entity'

@Entity()
export class User extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @ApiProperty()
  @Column({ length: 64, nullable: false, unique: true })
  email: string

  @IsNotEmpty()
  @ApiProperty()
  @Column({ nullable: false, unique: true })
  username: string

  @IsNotEmpty()
  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string

  @Length(0, 255)
  @ApiProperty()
  @Column({ length: 255, nullable: true })
  bio: string

  @Column()
  @ApiProperty()
  fcmToken: string

  @Column({ length: 2, nullable: true })
  @ApiProperty({ enum: languageNames })
  language: string

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

  @Column({ default: false })
  @ApiProperty()
  isPrivate: boolean

  @Column({ default: false })
  @ApiProperty()
  isViewPrivate: boolean

  @Column({ default: false })
  photoCheck: boolean

  @OneToOne(() => UserAbout, (userAbout) => userAbout.user, { eager: true, cascade: true })
  about: UserAbout

  @OneToMany(() => UserLabel, (userLabel) => userLabel.user, { eager: true, cascade: true })
  @Transform(({ value }) => value.label)
  labels: UserLabel[]

  toJSON() {
    return instanceToPlain(this)
  }
}
