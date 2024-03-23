import { Controller } from '@nestjs/common'
import { ItemService } from './item.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('item')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
}
