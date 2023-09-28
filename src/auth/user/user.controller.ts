import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateLabelDto } from './dto/label/create-label-dto'
import { UserLabel } from './entity/user-label.entity'
import { CreateAboutDto } from './dto/about/create-about-dto'
import { UserAbout } from './entity/user-about.entity'
import { User } from './entity/user.entity'
import { CurrentUser } from 'src/decorators/decorators'
import { UpdateAboutDto } from './dto/about/update-about-dto'

@Controller('user')
@ApiTags('user')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('label/add')
  @ApiOkResponse({
    type: UserLabel
  })
  public async addLabelToUser(@Body() createLabelDto: CreateLabelDto): Promise<UserLabel> {
    return this.userService.addLabelToUser(createLabelDto)
  }

  @Post('about/add')
  @ApiOkResponse({
    type: UserAbout
  })
  public async addAboutToUser(@Body() createAboutDto: CreateAboutDto): Promise<UserAbout> {
    return this.userService.addAboutToUser(createAboutDto)
  }

  @Put('about/edit/:id')
  @ApiOkResponse({
    type: UserAbout
  })
  public async editAboutOfUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateAbout: UpdateAboutDto): Promise<UserAbout> {
    return await this.userService.updateAboutOfUser(id, updateAbout)
  }

  @Get(':id')
  @ApiOkResponse({
    type: User
  })
  @ApiParam({
    name: 'id',
    description: 'Id of User to get',
    required: true,
    type: String
  })
  public async getSingleUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<User> {
    return this.userService.findById(id, user)
  }

  @Post('follow/:id')
  @ApiOkResponse({
    type: User
  })
  @ApiParam({
    name: 'id',
    description: 'Id of User to be Followed',
    required: true,
    type: String
  })
  public async followUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.userService.followUser(id, user)
  }
}
