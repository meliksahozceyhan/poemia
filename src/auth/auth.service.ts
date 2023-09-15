/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user/user.service'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { User } from './user/entity/user.entity'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  //TODO: Add register and sign-in here. register takes registerDto. SignIn takes signIn dto and approves password.

  public async signUp(registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto)
    return this.createToken(user)
  }

  public async login(loginDto: LoginDto) {
    if (loginDto.username !== undefined && loginDto.username !== null) {
      const user = await this.userService.findUserByUserName(loginDto.username)
      if (await bcrypt.compare(loginDto.password, user.password as string)) {
        return this.createToken(user)
      }
      throw new UnauthorizedException('auth.wrongPassword')
    }
    throw new Error('user.email')
  }

  public async silentRenew(token: string, refreshToken: string, user: User) {
    const user1 = await this.userService.findUserByUserName(user.username)
    if (await bcrypt.compare(token, refreshToken as string)) {
      return this.createToken(user1)
    }
    throw new UnauthorizedException('auth.malfunctionedRefreshToken')
  }

  private async createToken(user: User) {
    const { password, ...rest } = user
    const access_token = this.jwtService.sign(rest)
    const refreshToken = await bcrypt.hash(access_token, 10)
    return {
      access_token,
      refreshToken,
      iat: new Date()
    }
  }
}
