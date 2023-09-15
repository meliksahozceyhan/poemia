import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from '../dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  public async findUserByUserName(username: string): Promise<User> {
    return await this.repository.findOne({ where: { username: username } })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email: email } })
  }

  public async createUser(registerDto: RegisterDto): Promise<User> {
    registerDto.password = await bcrypt.hash(registerDto.password as string, 10)
    return await this.repository.save(registerDto)
  }
}
