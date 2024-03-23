import { HttpStatus } from '@nestjs/common'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Request, Response } from 'express'
import { capitilizeKey } from 'src/util/functions'
import { QueryFailedError } from 'typeorm'

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter<QueryFailedError> {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = HttpStatus.INTERNAL_SERVER_ERROR
    let key = ''

    console.error(exception)
    if (exception.driverError.routine === '_bt_check_unique') {
      const extractMessageRegex = /\((.*?)(?:(?:\)=\()(?!.*(\))(?!.*\))=\()(.*?)\)(?!.*\)))(?!.*(?:\)=\()(?!.*\)=\()((.*?)\))(?!.*\)))/
      const exceptionDetail =
        exception.driverError.detail.length <= 200 ? exception.driverError.detail.replace(extractMessageRegex, '$1') : exception.driverError.detail
      key = exceptionDetail.split(' ')[1]
      key = key.includes('_') ? capitilizeKey(key) : key
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        detail: exception.driverError.detail,
        key: key
      })
      .send()
  }
}
