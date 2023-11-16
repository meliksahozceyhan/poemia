import { Injectable } from '@nestjs/common'
import { Matches } from 'class-validator'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  checkUserName(dto: DenemeDto) {
    return dto
  }
}

export class DenemeDto {
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username must contain only letters numbers and _ '
  })
  name: string
}
