import { ApiProperty } from '@nestjs/swagger'
import { User } from '../user/entity/user.entity'
import { Pinpoint } from 'aws-sdk'

export class JwtTokenResponse {
  @ApiProperty()
  access_token: string
  @ApiProperty()
  refreshToken: string
  @ApiProperty()
  iat: Date
  @ApiProperty()
  user: Partial<User>
}

export class OtpReponse {
  @ApiProperty()
  awsResponse: Pinpoint.MessageResponse
  @ApiProperty()
  referenceId: string
}

export class ForgotPasswordResponse {
  @ApiProperty()
  referenceId: string

  @ApiProperty()
  email: string
}
