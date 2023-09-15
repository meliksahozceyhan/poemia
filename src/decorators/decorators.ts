import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common'
import { IS_PUBLIC_KEY } from './decorator.constants'

export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true)

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  return request['user']
})
