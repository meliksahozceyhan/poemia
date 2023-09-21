import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmptyObject, IsObject, IsString, Length } from 'class-validator'
import { User } from '../entity/user.entity'
import { relationStatus } from 'src/util/enums'
import { Type } from 'class-transformer'

export class CreateAboutDto {
  @IsObject()
  @IsNotEmptyObject()
  @ApiProperty({ required: true })
  user: Partial<User>

  @IsString()
  @Length(0, 64)
  @ApiProperty()
  city?: string

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  birthdate?: Date | null

  @IsString()
  @ApiProperty()
  education: string

  @IsEnum(relationStatus)
  @ApiProperty({ enum: relationStatus })
  relationStatus: string
}
