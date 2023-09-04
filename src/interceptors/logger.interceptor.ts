import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'
import { WinstonLoggerService } from 'src/winston-logger/winston-logger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService, private readonly moduleRef: ModuleRef) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()

    if (request.method === 'POST' || request.method === 'PUT') {
      const meta = this.getLogMeta(request, context)
      return next.handle().pipe(tap((savedData) => this.logger.log(JSON.stringify(savedData), meta)))
    }

    return next.handle()
  }

  private getLogMeta(request: Request, context: ExecutionContext): LogMetadataInterface {
    const meta: LogMetadataInterface = {
      user: request.user,
      method: request.method,
      url: request.url,
      context: context.getClass().name,
      requestBody: request.body,
      entityClass: this.getControllerAndProviders(context)
    }
    return meta
  }

  private getControllerAndProviders(context: ExecutionContext): string {
    const controller = this.moduleRef.get(context.getClass(), { strict: false })
    const targetClass = controller[Object.keys(controller)[0]].repo?.target.name

    return targetClass || null
  }
}

interface LogMetadataInterface {
  user: object
  method: string
  url: string
  context: string
  requestBody: any
  entityClass?: string
}
