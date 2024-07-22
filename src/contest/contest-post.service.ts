import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ContestPost } from './entity/contest-post.entity'
import { Repository } from 'typeorm'
import { PostService } from 'src/post/post.service'
import { ContestService } from './contest.service'

@Injectable()
export class ContestPostService {
  constructor(
    @InjectRepository(ContestPost) private readonly repo: Repository<ContestPost>,
    private readonly postService: PostService,
    private readonly contestService: ContestService
  ) {}

  public async attendContestWithPostId(postId: string) {
    const postEnt = await this.postService.findById(postId)
    const activeContest = await this.contestService.getActiveContestOfTheWeek()
    const entity = this.repo.create()
    entity.contest = activeContest
    entity.post = postEnt
    entity.point = 0

    return await this.repo.save(entity)
  }

  public async increasePointOfPost(postId: string, point: number) {
    const entity = await this.repo.findOneByOrFail({ post: { id: postId } })
    entity.point += point
    await this.repo.save(entity)
  }
}
