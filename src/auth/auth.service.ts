/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user/user.service'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { User } from './user/entity/user.entity'
import { AWSPinpointImpl } from 'src/aws/pinpoint-aws'
import { ActivateAccountDto } from './dto/activate-account-dto'
import { Pinpoint } from 'aws-sdk'
import * as uuid from 'uuid'

@Injectable()
export class AuthService {
  otpResponses = []
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  public async signUp(registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto)
    const referenceId = uuid.v4()

    const response = await AWSPinpointImpl.sendOtpMessageToUser(user.phoneNumber, referenceId)
    this.otpResponses.push({ awsResponse: response, referenceId })
    return { awsResponse: response, referenceId }
  }

  public async activateAccount(dto: ActivateAccountDto) {
    const response = await AWSPinpointImpl.verifyOtpMessage(dto.phoneNumber, dto.otp, dto.referenceId)
    if (response.VerificationResponse.Valid) {
      return await this.activateUser(dto.phoneNumber)
    } else {
      throw new UnauthorizedException()
    }
  }

  private async activateUser(phoneNumber: string) {
    const user = await this.userService.findAndActivateUserByPhoneNumber(phoneNumber)
    return await this.createToken(user)
  }

  public async login(loginDto: LoginDto) {
    if (loginDto.username !== undefined && loginDto.username !== null) {
      const user = await this.userService.findUserByUserName(loginDto.username)
      if (!user.isActive) {
        throw new Error('Account not activated!')
      }
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
      return await this.createToken(user1)
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
