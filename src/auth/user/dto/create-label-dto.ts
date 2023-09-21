import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString, Length } from 'class-validator'
import { User } from '../entity/user.entity'

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @Length(1, 64)
  label: string

  @IsObject()
  @IsNotEmptyObject()
  @ApiProperty({ required: true })
  user: Partial<User>
}
