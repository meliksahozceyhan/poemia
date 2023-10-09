import { IsNotEmpty, Length } from 'class-validator'
import { BaseEntity } from 'src/sdk/entity/base.entity'
import { ItemTypes } from 'src/util/enums'
import { Column, Entity, OneToMany } from 'typeorm'
import { Item } from './item.entity'

@Entity()
export class ItemType extends BaseEntity {
  @IsNotEmpty()
  @Length(1, 64)
  @Column({ unique: true, nullable: false, length: 64 })
  name: string

  @IsNotEmpty()
  @Length(1, 32)
  @Column({ unique: true, nullable: false, length: 32 })
  code: string

  @IsNotEmpty()
  @Column({ enum: ItemTypes })
  type: ItemTypes

  @OneToMany(() => Item, (item) => item.itemType, { onDelete: 'RESTRICT' })
  items: Item[]
}
