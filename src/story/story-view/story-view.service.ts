import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { StoryView } from './entity/story-view.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class StoryViewService {
  constructor(@InjectRepository(StoryView) private readonly repository: Repository<StoryView>) {}

  public async viewStory(id: string, user: User) {
    try {
      const entity = { story: { id: id }, user: user }
      return await this.repository.save(entity)
    } catch (error) {
      console.error(error)
    }
  }
}
