import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { Gender, RelationStatus } from 'src/util/enums'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class UserAbout extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  city: string

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ nullable: true })
  birthDate: Date

  @Column({ enum: RelationStatus, nullable: true })
  @ApiProperty({ nullable: true, enum: RelationStatus })
  relationStatus: RelationStatus

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  education: string

  @Column({ nullable: true, enum: Gender })
  @ApiProperty({ enum: Gender, nullable: true })
  gender: Gender

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  link: string
}
