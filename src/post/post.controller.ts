import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { Post as PostEnt } from './entity/post.entity'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

@Controller('post')
@ApiTags('post')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Get('/:id')
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
}