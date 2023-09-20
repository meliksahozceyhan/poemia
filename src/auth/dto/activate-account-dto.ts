import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ActivateAccountDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  phoneNumber: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  otp: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  referenceId: string
}
