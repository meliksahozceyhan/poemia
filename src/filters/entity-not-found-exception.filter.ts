import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { EntityNotFoundError } from 'typeorm'
import { Request, Response } from 'express'

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter<EntityNotFoundError> {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
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
