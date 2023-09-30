/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException, Response } from '@nestjs/common'
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
import { ResendOtpDto } from './dto/resend-otp.dto'
import { ForgotPasswordResponse, JwtTokenResponse, OtpReponse } from './interfaces/responses'
import { InjectRepository } from '@nestjs/typeorm'
import { ForgotPassword } from './entity/forgot-password.entity'
import { Repository } from 'typeorm'
import { ResetPasswordDto } from './dto/reset-password-dto'
import { ConfirmOtpDto } from './dto/confirm-otp-dto'
import { MailService } from 'src/mail/mail.service'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'
import { UserNotActivatedError } from 'src/sdk/Error/UserNotActivatedError'

@Injectable()
export class AuthService {
  otpResponses = []
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ForgotPassword) private readonly forgotPasswordRepo: Repository<ForgotPassword>,
    private readonly mailService: MailService
  ) {}

  public async signUp(registerDto: RegisterDto): Promise<OtpReponse> {
    const user = await this.userService.createUser(registerDto)
    const referenceId = uuid.v4()

    const response = await AWSPinpointImpl.sendOtpMessageToUser(user.phoneNumber, referenceId)
    this.otpResponses.push({ awsResponse: response, referenceId })
    return { awsResponse: response.MessageResponse, referenceId }
  }

  public async resendOtp(phoneNumber: string): Promise<OtpReponse> {
    const referenceId = uuid.v4()

    const response = await AWSPinpointImpl.sendOtpMessageToUser(phoneNumber, referenceId)
    this.otpResponses.push({ awsResponse: response, referenceId })
    return { awsResponse: response.MessageResponse, referenceId }
  }

  public async activateAccount(dto: ActivateAccountDto): Promise<JwtTokenResponse> {
    const response = await AWSPinpointImpl.verifyOtpMessage(dto.phoneNumber, dto.otp, dto.referenceId)
    if (response.VerificationResponse.Valid) {
      return await this.activateUser(dto.phoneNumber)
    } else {
      throw new UnauthorizedException()
    }
  }

  private async activateUser(phoneNumber: string): Promise<JwtTokenResponse> {
    const user = await this.userService.findAndActivateUserByPhoneNumber(phoneNumber)
    return await this.createToken(user)
  }

  public async login(loginDto: LoginDto, response: Response): Promise<JwtTokenResponse> {
    if (loginDto.username !== undefined && loginDto.username !== null) {
      const user = await this.userService.findUserByUserName(loginDto.username)
      if (!user.isActive) {
        const resendOtpResponse = await this.resendOtp(user.phoneNumber)
        throw new UserNotActivatedError('Account not activated!', resendOtpResponse)
      }
      if (await bcrypt.compare(loginDto.password, user.password as string)) {
        return this.createToken(user)
      }
      throw new UnauthorizedException('auth.wrongPassword')
    }
    throw new BasePoemiaError('Email Is wrong')
  }

  public async silentRenew(token: string, refreshToken: string, user: User): Promise<JwtTokenResponse> {
    const user1 = await this.userService.findUserByUserName(user.username)
    if (await bcrypt.compare(token, refreshToken as string)) {
      return await this.createToken(user1)
    }
    throw new UnauthorizedException('auth.malfunctionedRefreshToken')
  }

  private async createToken(user: User): Promise<JwtTokenResponse> {
    const { password, ...rest } = user
    const access_token = this.jwtService.sign(rest)
    const refreshToken = await bcrypt.hash(access_token, 10)
    return {
      access_token,
      refreshToken,
      iat: new Date(),
      user: rest
    }
  }

  public async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const user = await this.userService.findByEmail(email)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const referenceId = uuid.v4()

    const forgotPassword = new ForgotPassword()
    forgotPassword.user = user
    forgotPassword.referenceId = referenceId
    forgotPassword.otpCode = otpCode
    await this.forgotPasswordRepo.save(forgotPassword)
    this.mailService.sendOTPMail(user, otpCode)
    return {
      referenceId: referenceId,
      email: user.email
    }
  }

  public async confimOTP(confirmOtpDto: ConfirmOtpDto): Promise<boolean> {
    const forgotEntity = await this.forgotPasswordRepo.findOneByOrFail({ referenceId: confirmOtpDto.referenceId })
    if (forgotEntity.user.email === confirmOtpDto.email) {
      if (confirmOtpDto.otp === forgotEntity.otpCode) {
        return true
      } else {
        return false
      }
    } else {
      throw new BasePoemiaError('Auth.WrongReferenceId')
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<JwtTokenResponse> {
    const referenceValue = await this.forgotPasswordRepo.findOneOrFail({
      where: {
        referenceId: resetPasswordDto.referenceId,
        user: { email: resetPasswordDto.email }
      }
    })
    const user = await this.userService.findByEmail(resetPasswordDto.email)

    return this.createToken(await this.userService.updatePasswordOfUser(resetPasswordDto.newPassword, user))
  }
}
