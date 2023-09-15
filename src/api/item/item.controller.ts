import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('item')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
}
