import { ApiProperty } from '@nestjs/swagger'

export class BasePoemiaErrorResponse {
  @ApiProperty({ default: 500 })
  statusCode: number

  @ApiProperty()
  timestamp: Date

  @ApiProperty()
  path: string

  @ApiProperty()
  message: string

  @ApiProperty()
  detail: string
}
