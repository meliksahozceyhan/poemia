import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './entity/message.entity'
import { Repository } from 'typeorm'
import { MessageDto } from './dto/message.dto'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { PageResponse } from 'src/sdk/PageResponse'
import { RoomService } from '../room/room.service'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
    @InjectQueue('view') private readonly viewQueue: Queue,
    private readonly roomService: RoomService
  ) {}

  public async saveMessage(dto: MessageDto, userId: string, participantsId: string[]) {
    let entity = this.repo.create()
    Object.assign(entity, dto)
    entity = await this.repo.save(entity)
    //await this.viewQueue.add('message', { messageId: entity.id, userId }, { removeOnComplete: true })
    await this.viewQueue.add('message:create', { messageId: entity.id, userIds: participantsId, sentBy: userId }, { removeOnComplete: true })
    //await this.messageViewService.viewMessage(entity.id, userId)
    await this.roomService.updateLastMessageDateOfRoom(dto.room.id)
    return entity
  }

  public async getMessagesOfRoom(roomId: string, page: number, size: number) {
    const response = await this.repo.findAndCount({
      where: { room: { id: roomId } },
      order: { createdAt: 'DESC' },
      skip: page * size,
      take: size
    })

    return new PageResponse(response, page, size)
  }

  public async saveMessageToGeneralChat(dto: MessageDto, userId: string, generalRoomId: string) {
    let entity = this.repo.create()
    Object.assign(entity, dto)
    entity = await this.repo.save({ ...entity, sentBy: { id: userId }, room: { id: generalRoomId } })

    return entity
  }
}
