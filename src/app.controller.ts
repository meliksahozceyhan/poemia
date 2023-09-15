import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from './decorators/decorators'

@Controller()
@ApiTags('Poemia')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@CurrentUser() user: any): string {
    console.log(user)
    return this.appService.getHello()
  }
}
