import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { PostLikeService } from './post-like/post-like.service'
import { PostCommentService } from './post-comment/post-comment.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { PostRepostService } from './post-repost/post-repost.service'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { PostLikeDto } from './post-like/dto/post-like.dto'
import { PostCommentCreateDto } from './post-comment/dto/post-comment-create.dto'
import { PostLike } from './post-like/entity/post-like.entity'
import { PostComment } from './post-comment/entity/post-comment.entity'
import { PostRepost } from './post-repost/entity/post-repost.entity'

@Controller('post/actions')
@ApiTags('post')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class PostActionController {
  constructor(
    @InjectQueue('view') private readonly viewQueue: Queue,
    private readonly postLikeService: PostLikeService,
    private readonly postCommentService: PostCommentService,
    private readonly postRepostService: PostRepostService
  ) {}

  @Post(':postId/view')
  @ApiCreatedResponse({
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async viewPost(@Param('postId', ParseUUIDPipe) postId: string, @CurrentUser() user: User) {
    await this.viewQueue.add('post', { postId, user })
  }

  @Post(':postId/like')
  @ApiCreatedResponse({
    type: PostLike,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async likePost(@Param('postId', ParseUUIDPipe) postId: string, @Body() postLikeDto: PostLikeDto, @CurrentUser() user: User) {
    return await this.postLikeService.likePost(postId, postLikeDto, user)
  }

  @Post(':postId/comment')
  @ApiCreatedResponse({
    type: PostComment,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async commentPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() postCommentCreateDto: PostCommentCreateDto,
    @CurrentUser() user: User
  ) {
    return await this.postCommentService.createCommentOnPost(postId, postCommentCreateDto, user)
  }

  @Post(':postId/repost')
  @ApiCreatedResponse({
    type: PostRepost,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async repostPost(@Param('postId', ParseUUIDPipe) postId: string, @CurrentUser() user: User) {
    return await this.postRepostService.repostPost(postId, user)
  }
}
