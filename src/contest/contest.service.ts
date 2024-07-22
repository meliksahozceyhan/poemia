import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contest } from './entity/contest.entity'
import { Repository } from 'typeorm'
import { ContestStatus } from './enum/contest-status.enum'
import { ContestTopic } from './enum/contest-topic.enum'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'

@Injectable()
export class ContestService {
  constructor(@InjectRepository(Contest) private readonly repo: Repository<Contest>) {}

  public async getActiveContestOfTheWeek() {
    return await this.repo.findOneByOrFail({ contestStatus: ContestStatus.ACTIVE })
  }

  public async findActiveContestOfTheWeek() {
    return await this.repo.findOne({ where: { contestStatus: ContestStatus.ACTIVE } })
  }

  public async findCompletedContestOfTheWeek() {
    return await this.repo.findOne({ where: { contestStatus: ContestStatus.FINISHED } })
  }

  public async finishContest() {
    const entity = await this.findCompletedContestOfTheWeek()
    entity.contestStatus = ContestStatus.FINISHED
    //TODO: ranking calculations -> calculations made when any action is taken on the post

    return await this.repo.save(entity)
  }

  public async completeContestOfTheWeek() {
    const entity = await this.findActiveContestOfTheWeek()
    entity.contestStatus = ContestStatus.HISTORY

    return await this.repo.save(entity)
  }

  public async createContestByContestTopic(contestTopic: ContestTopic) {
    const respone = await this.findActiveContestOfTheWeek()
    if (respone !== null) {
      throw new BasePoemiaError('contest.thereIsActiveContest')
    }
    const entity = this.repo.create()
    entity.contestTopic = contestTopic
    entity.contestStatus = ContestStatus.ACTIVE

    await this.completeContestOfTheWeek()

    return await this.repo.save(entity)
  }
}
