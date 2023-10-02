import { Body, Controller, Get, Post, Query, Request, UseFilters } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser, SkipAuth } from 'src/decorators/decorators'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from './user/entity/user.entity'
import { RefreshDto } from './dto/refresh.dto'
import { ActivateAccountDto } from './dto/activate-account-dto'
import { ForgotPasswordResponse, JwtTokenResponse, OtpReponse } from './interfaces/responses'
import { ValidateEmailPipe } from 'src/sdk/pipes/parse-email-pipe'
import { ConfirmOtpDto } from './dto/confirm-otp-dto'
import { ResetPasswordDto } from './dto/reset-password-dto'
import { UserNotActivatedErrorFilter } from 'src/filters/user-not-activater-error.filter'
import { OtpRequestEmailDto } from './dto/otp-request-email-dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('/signup')
  @ApiOkResponse({
    type: OtpReponse
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async signUp(@Body() registerDto: RegisterDto): Promise<OtpReponse> {
    return this.authService.signUp(registerDto)
  }

  @SkipAuth()
  @Post('login')
  @ApiOkResponse({
    type: JwtTokenResponse
  })
  @UseFilters(new UserNotActivatedErrorFilter())
  @ApiResponse({
    status: 417,
    description: 'If user not activated return OTP response.',
    type: OtpReponse
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async login(@Body() loginDto: LoginDto): Promise<JwtTokenResponse> {
    return await this.authService.login(loginDto)
  }

  @Post('silent-renew')
  @ApiOkResponse({
    type: JwtTokenResponse
  })
  public async silentRenew(@Request() request: Request, @Body() refreshToken: RefreshDto, @CurrentUser() user: User): Promise<JwtTokenResponse> {
    return this.authService.silentRenew(request.headers['authorization'].split(' ')[1], refreshToken.refreshToken, user)
  }

  @SkipAuth()
  @Post('forgot-password')
  @ApiBadRequestResponse({ description: 'Email must be email.' })
  @ApiOkResponse({
    type: ForgotPasswordResponse,
    description: 'returns OTP response.'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async forgotPassword(@Query('email', ValidateEmailPipe) email: string): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(email)
  }

  @SkipAuth()
  @Post('activate')
  @ApiOkResponse({
    type: JwtTokenResponse,
    description: 'returns JWT response.'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async activateUser(@Body() activateAccountDto: ActivateAccountDto): Promise<JwtTokenResponse> {
    return this.authService.activateAccount(activateAccountDto)
  }

  @SkipAuth()
  @Get('resend-code')
  @ApiOkResponse({
    type: OtpReponse,
    description: 'returns OTP response.'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async resendOtpCode(@Query('phoneNumber') phoneNumber: string): Promise<OtpReponse> {
    return this.authService.resendOtp(phoneNumber)
  }

  @SkipAuth()
  @Post('confirm/email/otp')
  @ApiOkResponse({
    type: Boolean,
    description: 'If the given values are correct return true, Else return false '
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async confirmEmailOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
    return this.authService.confimOTP(confirmOtpDto)
  }

  @SkipAuth()
  @Post('reset/password')
  @ApiOkResponse({
    type: JwtTokenResponse,
    description: 'returns JWT response. with new credentials'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<JwtTokenResponse> {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @SkipAuth()
  @Post('resend-code/email')
  @ApiOkResponse({
    type: ForgotPasswordResponse,
    description: 'Use this end-point to get the OTP via Email'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async requestOtpViaEmail(@Body() otpRequestEmailDto: OtpRequestEmailDto): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(otpRequestEmailDto.email)
  }

  @SkipAuth()
  @Post('activate/account/email')
  @ApiOkResponse({
    type: JwtTokenResponse,
    description: 'Use this end point to activate the user from Email OTP'
  })
  @ApiOperation({
    summary: 'PUBLIC END POINT '
  })
  public async activateUserViaOTp(@Body() confirmOtpDto: ConfirmOtpDto): Promise<JwtTokenResponse> {
    return this.authService.activateAccountViaEmailOtp(confirmOtpDto)
  }
}
