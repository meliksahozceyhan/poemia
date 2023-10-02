import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class OtpRequestEmailDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
