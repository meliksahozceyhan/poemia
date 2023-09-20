import { Body, Controller, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser, SkipAuth } from 'src/decorators/decorators'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ApiTags } from '@nestjs/swagger'
import { User } from './user/entity/user.entity'
import { RefreshDto } from './dto/refresh.dto'
import { ActivateAccountDto } from './dto/activate-account-dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('/signup')
  public async signUp(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.signUp(registerDto)
  }

  @SkipAuth()
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto)
  }

  @Post('silent-renew')
  public async silentRenew(@Request() request: Request, @Body() refreshToken: RefreshDto, @CurrentUser() user: User) {
    return this.authService.silentRenew(request.headers['authorization'].split(' ')[1], refreshToken.refreshToken, user)
  }

  @SkipAuth()
  @Post('activate')
  public async activateUser(@Body() activateAccountDto: ActivateAccountDto) {
    return this.authService.activateAccount(activateAccountDto)
  }
}
