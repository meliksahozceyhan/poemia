import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm'
import { Post } from './entity/post.entity'
import { UserService } from 'src/auth/user/user.service'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
    dataSource.subscribers.push(this)
    console.log('Subscriber Inıti')
  }

  listenTo() {
    return Post
  }

  afterInsert(event: InsertEvent<Post>) {
    console.log('Inside Post subscriber')
    const post = event.entity
    this.userService.increaseProgressAfterPostCreation(post.user)
  }
}
