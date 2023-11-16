import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { CreateAboutDto } from './dto/about/create-about-dto'
import { UserAbout } from './entity/user-about.entity'
import { User } from './entity/user.entity'
import { CurrentUser, SkipAuth } from 'src/decorators/decorators'
import { UpdateAboutDto } from './dto/about/update-about-dto'
import { UserActionService } from './user-actions.service'
import { UserBlocked } from './entity/user-blocked.entity'
import { UserNameChange } from './entity/user-name-change.entity'
import { UserNameChangeDto } from './dto/detail/user-name-change-dto'
import { FcmTokenUpdateDto } from './dto/fcm-token-update-dto'
import { UpdateUserDto } from './dto/update-user-dto'
import { ApiOkResponsePaginated } from 'src/sdk/swagger-helper/api-ok-response-paginated'
import { UserFollow } from './entity/user-follow.entity'

@Controller('user')
@ApiTags('user')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class UserController {
  constructor(private readonly userService: UserService, private readonly userActionService: UserActionService) {}
  /* 
  @Post('label/add')
  @ApiOkResponse({
    type: UserLabel
  })
  public async addLabelToUser(@Body() createLabelDto: CreateLabelDto): Promise<UserLabel> {
    return this.userService.addLabelToUser(createLabelDto)
  } */

  @Post('about/add')
  @ApiCreatedResponse({
    type: UserAbout
  })
  public async addAboutToUser(@Body() createAboutDto: CreateAboutDto, @CurrentUser() user: User): Promise<UserAbout> {
    return this.userService.addAboutToUser(createAboutDto, user)
  }

  @Put('about/edit/:id')
  @ApiOkResponse({
    type: UserAbout
  })
  public async editAboutOfUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateAbout: UpdateAboutDto): Promise<UserAbout> {
    return await this.userService.updateAboutOfUser(id, updateAbout)
  }

  @Get('/:id')
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
    return this.userService.getById(id, user)
  }

  @Post('follow/:id')
  @ApiCreatedResponse({
    type: User
  })
  @ApiParam({
    name: 'id',
    description: 'Id of User to be Followed',
    required: true,
    type: String
  })
  public async followUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.userActionService.followUser(id, user)
  }

  @Post('block/:id')
  @ApiCreatedResponse({
    type: UserBlocked
  })
  @ApiParam({
    name: 'id',
    description: 'Id of User to be Blocked',
    required: true,
    type: String
  })
  public async blockUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.userActionService.blockUser(id, user)
  }

  @Put('edit/username')
  @ApiOkResponse({
    type: UserNameChange
  })
  @ApiInternalServerErrorResponse({
    description: 'You have changed your username less than 15 days ago'
  })
  public async changeName(@Body() usernameChangeDto: UserNameChangeDto, @CurrentUser() user: User) {
    return await this.userService.changeUsername(usernameChangeDto, user)
  }

  @Get('username/exists/:username')
  @ApiOkResponse({
    type: Boolean,
    description: 'OPEN End point. does not need auth.'
  })
  @ApiParam({
    name: 'username',
    description: 'username to check',
    required: true,
    type: String
  })
  @SkipAuth()
  public async doesUserNameExist(@Param('username') username: string): Promise<boolean> {
    return await this.userService.doesUserNameExists(username)
  }

  //TODO: This Will be removed when going to prod.
  @Delete('public/delete/:email')
  @ApiParam({
    name: 'email',
    description: 'email of user to delete',
    required: true,
    type: String
  })
  @ApiNoContentResponse({ description: 'Default Response when successfull.' })
  @SkipAuth()
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async deleteByEmail(@Param('email') email: string) {
    return await this.userService.deleteByEmail(email)
  }

  @Put('update/fcmToken')
  @ApiOkResponse({ type: User })
  public async updateFcmToken(@Body() fcmTokenUpdateDto: FcmTokenUpdateDto, @CurrentUser() user: User) {
    return await this.userService.updateFcmToken(user.id, fcmTokenUpdateDto)
  }

  @Get('profile/self')
  @ApiOkResponse({ type: User })
  public async getSelfProfile(@CurrentUser() user: User) {
    return await this.userService.findById(user.id)
  }

  @Put(':id')
  @ApiOkResponse({ type: UpdateUserDto })
  public async updateProfile(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: User) {
    return await this.userService.updateUser(id, updateUserDto, currentUser)
  }

  @Get('/follower/:id')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(UserFollow)
  public async getFollowersOfUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number
  ) {
    return await this.userService.getFollowersOfUser(id, page, size)
  }

  @Get('/following/:id')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(UserFollow)
  public async getFollowingsOfUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number
  ) {
    return await this.userService.getFollowingsOfUser(id, page, size)
  }

  @Get('/selfProfileViewers')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(UserFollow)
  public async getSelfProfileViewers(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.userService.getSelfProfileViewers(page, size, user)
  }

  @Get('/search/searchUserByUsername')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(User)
  public async searchUsersByUserName(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('username') username: string
  ) {
    return await this.userService.searchUsersByUsername(username, page, size)
  }

  @Get('self/getSelfProgress')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    type: 'number',
    description: 'This end-point will return the progress points of user ranging from 0 to 120'
  })
  public async getUserProgress(@CurrentUser() user: User) {
    return await this.userService.getUserProgress(user)
  }
}
