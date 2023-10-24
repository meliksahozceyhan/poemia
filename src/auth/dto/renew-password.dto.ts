import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class RenewPasswordDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  oldPassword?: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  newPassword: string
}
