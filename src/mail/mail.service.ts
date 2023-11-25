import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { User } from 'src/auth/user/entity/user.entity'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  constructor(private readonly mailerService: MailerService) {}

  public async sendOTPMail(user: User, otpCode: string) {
    this.logger.debug(`Sending email to ${user.email}`)
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Code From Poemia',
      template: './forgot-password',
      context: {
        name: user.username,
        OTPCode: otpCode
      }
    })
    this.logger.debug(`Email sent to ${user.email}`)
  }
}
