import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Room } from './entity/room.entity'
import { EntityManager, Repository } from 'typeorm'
import { RoomRedisService } from 'src/redis/service/room.redis.service'
import { RoomDTO } from './dto/room.dto'
import { User } from 'src/auth/user/entity/user.entity'
import { PageResponse } from 'src/sdk/PageResponse'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly repo: Repository<Room>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly roomRedis: RoomRedisService
  ) {}

  public async createRoom(dto: RoomDTO, user: User) {
    const entity = await this.repo.create()
    Object.assign(entity, dto)
    entity.createdBy = user
    const result = await this.repo.save(entity)
    const userIdList = entity.participants.map((user) => user.id)
    this.roomRedis.saveParticipantsOfRoomToCache(result.id, userIdList)
    return result
  }

  public async updateRoom(id: string, dto: RoomDTO) {
    const entity = await this.repo.findOneByOrFail({ id: id })
    const removedUserIds = dto.participants.filter((u) => !entity.participants.map((us) => us.id).includes(u.id)).map((u) => u.id) //filter for finding the removed users
    const userIdList = entity.participants.map((user) => user.id) //latest userId list.
    Object.assign(entity, dto)
    const updatedEntity = await this.repo.save(entity)
    this.roomRedis.removeParticipantsFromRoom(entity.id, removedUserIds) // remove old participants list in cache
    this.roomRedis.saveParticipantsOfRoomToCache(entity.id, userIdList)
    return updatedEntity
  }

  public async updateLastMessageDateOfRoom(id: string) {
    return await this.repo.update({ id: id }, { lastMessageDate: new Date() })
  }

  public async getAllRoomsOfUser(page: number, size: number, userId: string) {
    const result = await this.getQueryBuilderForRoom(userId)
      .skip(page * size)
      .take(size)
      .getManyAndCount()

    const roomIds = result[0].map((r) => r.id)
    const unreadMessageCountPerRoom = await this.getRoomsAndUnreadMessageCounts(userId, roomIds)
    //console.log(await this.getLastMessageOfRoom(roomIds))

    const newRes: [any, number] = [
      result[0].map((r) => {
        const unreadMessageCount = unreadMessageCountPerRoom.find((val) => val.roomId === r.id)
        return { ...r, unreadMessageCount: unreadMessageCount !== undefined ? unreadMessageCount.unreadMessageCount : 0 }
      }),
      result[1]
    ]
    return new PageResponse(newRes, page, size)
  }

  private async getRoomsAndUnreadMessageCounts(userId: string, roomIds: string[]): Promise<any[]> {
    const queryBuilder = this.entityManager
      .getRepository(Room)
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.participants', 'participant')
      .leftJoinAndSelect('room.messages', 'message')
      .leftJoinAndSelect('message.views', 'view', 'view.user.id = :userId AND view.isRead = :isRead', { userId, isRead: false })
      .select(['room.id as "roomId"', 'COUNT(DISTINCT view.id) AS "unreadMessageCount"'])
      .whereInIds(roomIds)
      .groupBy('room.id')

    const results = await queryBuilder.getRawMany()

    return results
  }

  private getQueryBuilderForRoom(userId: string) {
    const queryBuilder = this.entityManager
      .createQueryBuilder(Room, 'room')
      .leftJoinAndMapOne('room.createdBy', 'room.createdBy', 'createdBy', 'room.createdBy.id = createdBy.id')
      .leftJoin('room.participants', 'participants')
      .leftJoinAndMapMany('room.participants', 'room.participants', 'participants2')
      .leftJoinAndMapOne('room.lastMessage', 'room.messages', 'lastMessage', 'lastMessage.room.id = room.id')
      .leftJoinAndMapOne('lastMessage.sentBy', 'lastMessage.sentBy', 'sentBy2', 'lastMessage.sentBy.id = sentBy2.id')
      .where(`participants.id = :userId `, { userId: userId })
      .orderBy('lastMessage.createdAt', 'DESC')
    return queryBuilder
  }

  public async getSingleRoom(id: string) {
    return await this.repo.findOneByOrFail({ id: id })
  }

  public async getGeneralChatRoom(user: User) {
    return await this.repo.findOneByOrFail({ isGeneralChat: true, language: user.language })
  }

  public async getGeneralRoomIds() {
    return await this.repo.findBy({ isGeneralChat: true })
  }
}
