import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { PostLikeService } from './post-like/post-like.service'
import { PostCommentService } from './post-comment/post-comment.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { PostRepostService } from './post-repost/post-repost.service'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { PostLikeDto } from './post-like/dto/post-like.dto'
import { PostCommentCreateDto } from './post-comment/dto/post-comment-create.dto'
import { PostLike } from './post-like/entity/post-like.entity'
import { PostComment } from './post-comment/entity/post-comment.entity'
import { PostRepost } from './post-repost/entity/post-repost.entity'
import { PostHighlightService } from './post-highlight/post-highlight.service'
import { BasePoemiaErrorResponse } from 'src/sdk/ErrorResponse'

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
    private readonly postRepostService: PostRepostService,
    private readonly postHighlightService: PostHighlightService
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
    await this.viewQueue.add('post', { postId, user }, { removeOnComplete: true })
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
    //TODO: after like.post add an event to the queue too add points to a post taht is a part of the competition. 1 points for normal like 2 points for the super like
    return await this.postLikeService.likePost(postId, postLikeDto, user)
  }

  @Get(':postId/like')
  @ApiCreatedResponse({
    type: PostLike,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async getPostLike(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number
  ) {
    return await this.postLikeService.getLikesOfPost(postId, page, size)
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
    //TODO: after commentPost add an event to the queue too add points to a post taht is a part of the competition. 0.5 points for comment.
    return await this.postCommentService.createCommentOnPost(postId, postCommentCreateDto, user)
  }

  @Get(':postId/comment')
  @ApiCreatedResponse({
    type: PostComment,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.postCommentService.getCommentsOfPost(postId, page, size, user.id)
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
  @ApiInternalServerErrorResponse({
    type: BasePoemiaErrorResponse,
    description: 'A user can not repost his/her own post. When he/she tries it an error with 500 Code will return'
  })
  public async repostPost(@Param('postId', ParseUUIDPipe) postId: string, @CurrentUser() user: User) {
    return await this.postRepostService.repostPost(postId, user)
  }

  @Post(':postId/high-light')
  @ApiCreatedResponse({
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async highLightPost(@Param('postId', ParseUUIDPipe) postId: string, @CurrentUser() user: User) {
    await this.postHighlightService.highlightPost(postId, user)
  }

  @Post(':commentId/comment/like')
  @ApiCreatedResponse({
    type: PostComment,
    description: 'When this api triggered. response with an empty body will return.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiBearerAuth()
  public async likeComment(@Param('commentId', ParseUUIDPipe) commentId: string, @CurrentUser() user: User) {
    return await this.postCommentService.likeComment(commentId, user)
  }

  @Delete(':commentId')
  @ApiNoContentResponse({
    description: 'This is the successful case response.'
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiInternalServerErrorResponse({
    type: BasePoemiaErrorResponse,
    description: 'When user trying to delete a comment that is not registered by itself. throws this error "Cannot Delete others comment"'
  })
  public async deleteComment(@Param('commentId', ParseUUIDPipe) commentId: string, @CurrentUser() user: User) {
    return await this.postCommentService.deleteComment(commentId, user)
  }
}
