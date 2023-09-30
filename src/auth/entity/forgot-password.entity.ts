import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../user/entity/user.entity'
import { Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base.entity'

@Entity()
export class ForgotPassword extends BaseEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ nullable: false, unique: true })
  referenceId: string

  @Column({ length: 6, nullable: false })
  @Length(1, 6)
  otpCode: string
}
