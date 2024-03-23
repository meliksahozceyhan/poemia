import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { Post as PostEnt } from './entity/post.entity'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ApiOkResponsePaginated } from 'src/sdk/swagger-helper/api-ok-response-paginated'
import { PostRepostService } from './post-repost/post-repost.service'
import { LanguageNames } from 'src/util/languages'

@Controller('post')
@ApiTags('post')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postRepostService: PostRepostService
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiCreatedResponse({
    description: 'Use this to create a post in draft mode. if you sent isDraft flag false. It will be immediately published.',
    type: PostEnt
  })
  public async createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User): Promise<PostEnt> {
    return await this.postService.createPost(createPostDto, user)
  }

  @Get('single/:id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    description: 'Use This end-point in order to get a singular post',
    type: PostEnt
  })
  public async getPost(@Param('id', ParseUUIDPipe) id: string): Promise<PostEnt> {
    return await this.postService.findById(id)
  }

  @Get('/all')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(PostEnt)
  public async getAllPostsByPagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.getPostList(page, size, user)
  }

  @Get('/countOfPosts')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    description: 'Use This end-point for Retrieving the daily PostCountOf the user',
    type: 'number'
  })
  public async countOfPosts(@CurrentUser() user: User): Promise<number> {
    return this.postService.countPostSharedByUserDaily(user)
  }

  @Get('/feed')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    description: 'Use This end-point in order to get a singular post',
    type: PostEnt
  })
  public async getFeed(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('language') language: LanguageNames,
    @CurrentUser() user: User
  ) {
    return await this.postService.getFeedWithUser(page, size, user.id, user.language)
  }

  @Get('/readers')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    description: 'Use This end-point in order to get a singular post',
    type: PostEnt
  })
  public async getReadersVideos(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('language') language: LanguageNames,
    @CurrentUser() user: User
  ) {
    return await this.postService.getReadersVideos(page, size, user.id)
  }

  @Get('/user/:id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponse({
    description: 'Use This end-point in order to get a singular post',
    type: PostEnt
  })
  public async getPostsOfUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.getPostsOfUser(page, size, id, user.id)
  }

  @Get('user/repoems/:id')
  public async getRePoemsOfUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postRepostService.getRepostsOfUserWithAnotherUser(id, page, size, user)
  }

  @Get('popular')
  public async getPopular(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.getPopularPosts(page, size, user, query)
  }

  @Get('explore')
  public async getExplore(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.getExplore(page, size, user, query)
  }

  @Get('search')
  public async getSearch(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.search(page, size, user, query)
  }

  @Get('videos')
  public async getVideos(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postService.getVideos(page, size, user, query)
  }
}
