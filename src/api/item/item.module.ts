import { Module } from '@nestjs/common'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ItemType } from './entities/item_type.entity'
import { Item } from './entities/item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ItemType, Item])],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
