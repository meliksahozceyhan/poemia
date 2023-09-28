import { HttpException, HttpStatus } from '@nestjs/common'

export class BasePoemiaError extends HttpException {
  constructor(message: string) {
    super(message || 'Not Found', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
