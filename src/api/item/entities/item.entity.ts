import { IsNotEmpty, IsNumber, Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base-entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ItemType } from './item_type.entity'

@Entity()
export class Item extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @Column({ unique: true, nullable: false, length: 64 })
  name: string

  @IsNotEmpty()
  @Length(1, 32)
  @Column({ unique: true, nullable: false, length: 32 })
  code: string

  @Column()
  explanation: string

  @IsNotEmpty()
  @IsNumber()
  @Column({})
  price: number

  @ManyToOne(() => ItemType, { eager: true })
  @JoinColumn({ name: 'item_type_id' })
  itemType: ItemType
}
