import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from './decorator.constants'

export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true)
