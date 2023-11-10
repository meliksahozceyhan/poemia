import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(tokenPayload: any) {
    const user = await this.userService.findByEmail(tokenPayload.email)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user
    return rest
  }
}
