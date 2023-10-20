import { ApiProperty } from '@nestjs/swagger'

export class PageResponse<T> {
  private content: T[]

  @ApiProperty({ type: Number })
  private totalItemCount: number

  @ApiProperty()
  page: number
  @ApiProperty()
  size: number
  constructor(data: [T[], number], page: number, size: number) {
    this.content = data[0]
    this.totalItemCount = data[1]
    this.page = page
    this.size = size
  }
}
