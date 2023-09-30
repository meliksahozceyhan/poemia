import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { MoreThan, Repository } from 'typeorm'
import { RegisterDto } from '../dto/register.dto'
import * as bcrypt from 'bcrypt'
import { UserLabel } from './entity/user-label.entity'
import { UserAbout } from './entity/user-about.entity'
import { CreateLabelDto } from './dto/label/create-label-dto'
import { CreateAboutDto } from './dto/about/create-about-dto'
import { UserView } from './entity/user-view.entity'
import { UpdateAboutDto } from './dto/about/update-about-dto'
import { UserNameChangeDto } from './dto/detail/user-name-change-dto'
import { UserNameChange } from './entity/user-name-change.entity'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(UserLabel) private readonly labelRepository: Repository<UserLabel>,
    @InjectRepository(UserAbout) private readonly aboutRepository: Repository<UserAbout>,
    @InjectRepository(UserView) private readonly viewRepository: Repository<UserView>,
    @InjectRepository(UserNameChange) private readonly nameChangeRepo: Repository<UserNameChange>
  ) {}

  public async findUserByUserName(username: string): Promise<User> {
    return await this.repository.findOneByOrFail({ username: username })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.repository.findOneByOrFail({ email: email })
  }

  public async findById(id: string): Promise<User> {
    return await this.repository.findOneByOrFail({ id: id })
  }

  public async createUser(registerDto: RegisterDto): Promise<User> {
    registerDto.password = await bcrypt.hash(registerDto.password as string, 10)
    return await this.repository.save(registerDto)
  }

  public async doesUserNameExists(username: string): Promise<boolean> {
    return await this.repository.exist({ where: { username: username } })
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.repository.findOne({ where: { phoneNumber: phoneNumber } })
  }

  public async activateUser(user: User) {
    user.isActive = true
    return await this.repository.save(user)
  }

  public async findAndActivateUserByPhoneNumber(phoneNumber: string) {
    const user = await this.repository.findOneByOrFail({ phoneNumber: phoneNumber })
    user.isActive = true
    return await this.repository.save(user)
  }

  public async addLabelToUser(createLabelDto: CreateLabelDto): Promise<UserLabel> {
    return await this.labelRepository.save(createLabelDto)
  }

  public async addAboutToUser(createAboutDto: CreateAboutDto): Promise<UserAbout> {
    return await this.aboutRepository.save(createAboutDto)
  }

  public async updateAboutOfUser(id: string, dto: UpdateAboutDto) {
    const userAbout = await this.aboutRepository.findOneByOrFail({ id: id })
    Object.assign(userAbout, dto)
    return await this.aboutRepository.save(userAbout)
  }

  public async getById(id: string, user: User): Promise<User> {
    if (id !== user.id) {
      this.viewUser(id, user)
    }
    const foundUser = await this.repository.findOneByOrFail({ id: id })
    if (id === foundUser.id) {
      foundUser['self'] = true
      foundUser['views'] = await this.viewRepository.count({ select: { id: true }, where: { user: { id: foundUser.id } } })
    }
    return foundUser
  }

  public async updatePasswordOfUser(newPassword: string, userToSave: User): Promise<User> {
    userToSave.password = await bcrypt.hash(newPassword as string, 10)
    return await this.repository.save(userToSave)
  }

  public async changeUsername(usernameChangeDto: UserNameChangeDto, user: User): Promise<UserNameChange> {
    if (this.nameChangeRepo.exist({ where: { expiresAt: MoreThan(new Date()) } })) {
      throw new BasePoemiaError('You have changed your username less than 15 days ago')
    }
    const entity = await this.repository.findOneByOrFail({ id: user.id })
    entity.username = usernameChangeDto.name
    await this.updateUser(entity)
    const changeEntity = this.nameChangeRepo.create()
    changeEntity.user = entity
    changeEntity.before = user.username
    changeEntity.after = entity.username
    const now = new Date()
    now.setDate(now.getDate() + 14)
    changeEntity.expiresAt = now

    return await this.nameChangeRepo.save(changeEntity)
  }

  public async updateUser(user: User) {
    return await this.repository.save(user)
  }

  public async deleteByEmail(email: string) {
    return await this.repository.delete({ email: email })
  }

  private async viewUser(userId: string, viewer: User) {
    await this.viewRepository.save({ user: { id: userId }, viewer: viewer, isSecret: viewer.isViewPrivate })
  }
}
