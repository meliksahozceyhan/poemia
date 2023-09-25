import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ConfirmOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  otp: string

  @IsNotEmpty()
  @ApiProperty({ required: true })
  referenceId: string
}
