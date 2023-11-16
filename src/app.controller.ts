import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService, DenemeDto } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser, SkipAuth } from './decorators/decorators'
import { endOfDay, startOfDay } from 'date-fns'

@Controller()
@ApiTags('Poemia')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@CurrentUser() user: any): any {
    const dateStart = new Date('2023-10-24')
    const startDate = startOfDay(dateStart)
    const endDate = endOfDay(dateStart)
    console.log(startOfDay(dateStart))
    console.log(endOfDay(dateStart))
    return this.appService.getHello()
  }

  @Post()
  @SkipAuth()
  getDeneme(@Body() dto: DenemeDto): any {
    return this.appService.checkUserName(dto)
  }
}
