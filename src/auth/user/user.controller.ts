import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateLabelDto } from './dto/create-label-dto'
import { UserLabel } from './entity/user-label.entity'
import { CreateAboutDto } from './dto/create-about-dto'
import { UserAbout } from './entity/user-about.entity'
import { User } from './entity/user.entity'
import { UpdateAboutDto } from './dto/update-about-dto'

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('label/add')
  public async addLabelToUser(@Body() createLabelDto: CreateLabelDto): Promise<UserLabel> {
    return this.userService.addLabelToUser(createLabelDto)
  }

  @Post('about/add')
  public async addAboutToUser(@Body() createAboutDto: CreateAboutDto): Promise<UserAbout> {
    return this.userService.addAboutToUser(createAboutDto)
  }

  @Put('about/edit/:id')
  public async editAboutOfUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateAbout: UpdateAboutDto): Promise<UserAbout> {
    return await this.userService.updateAboutOfUser(id, updateAbout)
  }

  @Get(':id')
  public async getSingleUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findById(id)
  }
}
