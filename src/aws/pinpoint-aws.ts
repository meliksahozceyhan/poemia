import { Pinpoint } from 'aws-sdk'
import * as uuidv4 from 'uuid'

export class AWSPinpointImpl {
  private static pinpoint = new Pinpoint({ apiVersion: '2016-12-01', region: 'eu-central-1' })
  private static uuid = uuidv4

  public static async sendOtpMessageToUser(phoneNumber: string, referenceId: string) {
    const params = {
      ApplicationId: process.env.AWS_PINPOINT_PROJECT_ID,
      SendOTPMessageRequestParameters: {
        BrandName: 'Poemia',
        Channel: 'SMS',
        DestinationIdentity: phoneNumber,
        OriginationIdentity: 'PoemiaOTP',
        ReferenceId: referenceId,
        CodeLength: 6,
        ValidityPeriod: 5
      }
    }
    return this.pinpoint.sendOTPMessage(params).promise()
  }

  public static async verifyOtpMessage(destination: string, otp: string, referenceId: string) {
    const params = {
      ApplicationId: process.env.AWS_PINPOINT_PROJECT_ID,
      VerifyOTPMessageRequestParameters: {
        DestinationIdentity: destination,
        Otp: otp,
        ReferenceId: referenceId
      }
    }

    return this.pinpoint
      .verifyOTPMessage(params, (err, data) => {
        if (!err) {
          return data
        }
        throw err
      })
      .promise()
  }
}
