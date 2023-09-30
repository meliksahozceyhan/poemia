import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { UserNotActivatedError } from 'src/sdk/Error/UserNotActivatedError'
import { Request, Response } from 'express'

@Catch(UserNotActivatedError)
export class UserNotActivatedErrorFilter implements ExceptionFilter<UserNotActivatedError> {
  catch(exception: UserNotActivatedError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = HttpStatus.EXPECTATION_FAILED

    console.error(exception)

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        detail: exception.name,
        data: exception.body
      })
      .send()
  }
}
