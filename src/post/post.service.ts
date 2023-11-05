import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './entity/post.entity'
import { Between, Not, Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'
import { endOfDay, startOfDay } from 'date-fns'

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}

  public async findById(id: string): Promise<Post> {
    return await this.repo.findOneByOrFail({ id: id })
  }

  public async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    //TODO: Add premium check for user and calculate if the user has the permission to create post(Count by day.) 10 is the limit. Do not care the posttype
    //TODO: Add Point increase to here.
    const entity = this.repo.create()
    Object.assign(entity, createPostDto)
    entity.user = user
    return await this.repo.save(entity)
  }

  public async countByUser(user: User): Promise<number> {
    return await this.repo.count({ select: { id: true }, where: { user: { id: user.id } } })
  }

  public async getPostList(page: number, size: number, user: User) {
    const response = await this.repo.findAndCount({
      take: size,
      skip: page * size,
      order: { createdAt: 'DESC' }
    })
    return new PageResponse(response, page, size)
  }

  public async countPostSharedByUserDaily(user: User) {
    const dateStart = new Date()
    const startDate = startOfDay(dateStart)
    const endDate = endOfDay(dateStart)

    return await this.repo.count({
      select: { id: true },
      where: {
        createdAt: Between(startDate, endDate),
        user: { id: user.id }
      }
    })
  }
}
