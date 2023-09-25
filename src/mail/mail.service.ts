import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendOTPMail(user: User, otpCode: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Code From Poemia',
      template: './forgot-password',
      context: {
        name: user.username,
        OTPCode: otpCode
      }
    })
  }
}
