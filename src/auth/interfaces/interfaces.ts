import { User } from '../user/entity/user.entity'
import { Pinpoint } from 'aws-sdk'

export interface JwtTokenResponse {
  access_token: string
  refreshToken: string
  iat: Date
  user: Partial<User>
}

export interface OtpReponse {
  awsResponse: Pinpoint.MessageResponse
  referenceId: string
}
