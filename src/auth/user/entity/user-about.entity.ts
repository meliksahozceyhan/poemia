import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { relationStatus } from 'src/util/enums'
import { BaseEntity } from 'src/sdk/entity/base.entity'

@Entity()
export class UserAbout extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Exclude({ toPlainOnly: true })
  user: User

  @Column()
  city: string

  @Column({ type: 'date', nullable: true })
  birthDate: Date

  @Column({ enum: relationStatus, nullable: true })
  relationStatus: string

  @Column({ nullable: true })
  education: string
}
