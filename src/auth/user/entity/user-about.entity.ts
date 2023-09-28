import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { gender, relationStatus } from 'src/util/enums'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class UserAbout extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @Column()
  @ApiProperty()
  city: string

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  birthDate: Date

  @Column({ enum: relationStatus, nullable: true })
  @ApiProperty()
  relationStatus: string

  @Column({ nullable: true })
  @ApiProperty()
  education: string

  @Column({ nullable: true, enum: gender })
  @ApiProperty({ enum: gender })
  gender: string
}
