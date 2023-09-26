import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'

@Injectable()
export class FileService {
  AWS_S3_BUCKET = 'poemia'
  s3 = new S3()

  public async uploadFile(file: Express.Multer.File) {
    const { originalname } = file
    return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype)
  }

  private async s3_upload(file: Buffer, bucket: string, name: string, mimetype: string) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline'
    }

    try {
      const s3Response = await this.s3.upload(params).promise()
      return s3Response
    } catch (e) {
      console.log(e)
    }
  }
}
