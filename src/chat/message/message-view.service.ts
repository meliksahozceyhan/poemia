import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageView } from './entity/message-view.entity'
import { Repository } from 'typeorm'
import { SocketGateway } from '../socket/socket.gateway'

@Injectable()
export class MessageViewService {
  private readonly logger = new Logger(MessageViewService.name)

  constructor(
    @InjectRepository(MessageView) private readonly repo: Repository<MessageView>,
    @Inject(forwardRef(() => SocketGateway)) private readonly socketGateway: SocketGateway
  ) {}

  public async viewMessage(messageId: string, userId: string) {
    const entity = await this.repo.findOneOrFail({ where: { user: { id: userId }, message: { id: messageId } } })
    entity.isRead = true
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(error)
    }
  }

  public async viewMessageBulk(messageIds: string[], userId: string) {
    const entities = []
    for (let i = 0; i < messageIds.length; i++) {
      entities.push({ message: { id: messageIds[i] }, user: { id: userId } })
    }
    try {
      return await this.repo.save(entities)
    } catch (e) {
      this.logger.error(e)
      return null
    }
  }

  public async readUnreadMessagesOfRoom(roomId: string, userId: string) {
    const entities = await this.repo.find({ where: { user: { id: userId }, message: { room: { id: roomId } } } })
    //const res = await this.repo.update({ message: { room: { id: roomId } }, user: { id: userId } }, { isRead: true })
    for (let i = 0; i < entities.length; i++) {
      entities[i].isRead = true
    }
    this.socketGateway.notifyClientsOfReadMessages(roomId, userId)
    return await this.repo.save(entities)
  }

  public async createMessageReadEntitiesForUsers(messageId: string, userIds: string[], userId: string) {
    const entities = []
    for (let i = 0; i < userIds.length; i++) {
      entities.push({ user: { id: userIds[i] }, message: { id: messageId }, isRead: userId === userIds[i] })
    }
    try {
      return await this.repo.save(entities)
    } catch (e) {
      this.logger.error(e)
      return null
    }
  }
}
