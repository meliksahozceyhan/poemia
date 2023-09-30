import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotActivatedError extends HttpException {
  body: any
  constructor(message: string, body: any) {
    super(message || 'Not Found', HttpStatus.EXPECTATION_FAILED)
    this.body = body
  }
}
