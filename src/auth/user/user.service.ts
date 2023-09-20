import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from '../dto/register.dto'
import * as bcrypt from 'bcrypt'
import { CheckUsernameDto } from '../dto/check-username.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  public async findUserByUserName(username: string): Promise<User> {
    return await this.repository.findOneByOrFail({ username: username })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.repository.findOneByOrFail({ email: email })
  }

  public async createUser(registerDto: RegisterDto): Promise<User> {
    registerDto.password = await bcrypt.hash(registerDto.password as string, 10)
    return await this.repository.save(registerDto)
  }

  public async doesUserNameExists(checkUserNameDto: CheckUsernameDto): Promise<boolean> {
    return await this.repository.exist({ where: { username: checkUserNameDto.username } })
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
}
