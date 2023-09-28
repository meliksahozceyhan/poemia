import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { BasePoemiaError } from 'src/sdk/Error/BasePoemiaError'

@Catch(BasePoemiaError)
export class BasePoemiaErrorFilter implements ExceptionFilter<BasePoemiaError> {
  catch(exception: BasePoemiaError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = HttpStatus.NOT_FOUND

    console.error(exception)

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        detail: exception.name
      })
      .send()
  }
}
