import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './entity/post.entity'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}

  public async findById(id: string): Promise<Post> {
    console.log(id)
    return await this.repo.findOneByOrFail({ id: id })
  }

  public async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const entity = this.repo.create()
    Object.assign(entity, createPostDto)
    entity.user = user
    return await this.repo.save(entity)
  }

  public async countByUser(user: User): Promise<number> {
    return await this.repo.count({ select: { id: true }, where: { user: { id: user.id } } })
  }
}
