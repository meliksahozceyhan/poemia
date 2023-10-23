import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { Gender, RelationStatus } from 'src/util/enums'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsString } from 'class-validator'

@Entity()
export class UserAbout extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  city: string

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ nullable: true })
  @IsDate()
  birthDate: Date

  @Column({ type: 'enum', enum: RelationStatus, nullable: true })
  @ApiProperty({ nullable: true, enum: RelationStatus })
  @IsEnum(RelationStatus)
  relationStatus: RelationStatus

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  education: string

  @Column({ nullable: true, type: 'enum', enum: Gender })
  @ApiProperty({ type: 'enum', enum: Gender, nullable: true })
  @IsEnum(Gender)
  gender: Gender

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  @IsString()
  link: string
}
