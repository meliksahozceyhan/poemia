import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostHighlight } from './entity/post-highlight.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'
import { PostService } from '../post.service'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'

@Injectable()
export class PostHighlightService {
  constructor(
    @InjectRepository(PostHighlight) private readonly repo: Repository<PostHighlight>,
    @Inject(forwardRef(() => PostService)) private readonly postService: PostService
  ) {}

  public async highlightPost(id: string, user: User) {
    const post = await this.postService.findById(id)
    if (post.user.id !== user.id) {
      throw new BasePoemiaError('postHighlight.notSelfPost')
    }
    const expiresAt = this.calculateExpiresAt()
    return this.repo.save({ post: post, expiresAt: expiresAt })
  }

  private calculateExpiresAt(): Date {
    const date = new Date()
    const currentHour = new Date().getHours()
    const hourToCalc = currentHour + 6
    let hourToSet = null
    if (hourToCalc > 24) {
      hourToSet = hourToCalc % 24
      date.setDate(date.getDate() + 1)
      date.setHours(hourToSet)
    } else {
      date.setHours(hourToCalc)
    }
    return date
  }
}
