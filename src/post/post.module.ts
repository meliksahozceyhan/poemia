import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entity/post.entity'
import { PostComment } from './post-comment/entity/post-comment.entity'
import { PostCommentService } from './post-comment/post-comment.service'
import { PostLike } from './post-like/entity/post-like.entity'
import { PostLikeService } from './post-like/post-like.service'
import { PostViewService } from './post-view/post-view.service'
import { PostActionController } from './post-actions.controller'
import { BullModule } from '@nestjs/bull'
import { PostRepostService } from './post-repost/post-repost.service'
import { PostView } from './post-view/entity/post-view.entity'
import { PostRepost } from './post-repost/entity/post-repost.entity'
import { PostHighlightService } from './post-highlight/post-highlight.service'
import { PostHighlight } from './post-highlight/entity/post-highlight.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostComment, PostLike, PostView, PostRepost, PostHighlight]), BullModule.registerQueue({ name: 'view' })],
  controllers: [PostController, PostActionController],
  providers: [PostService, PostCommentService, PostLikeService, PostViewService, PostRepostService, PostHighlightService],
  exports: [PostViewService]
})
export class PostModule {}
