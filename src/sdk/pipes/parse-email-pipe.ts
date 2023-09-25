/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isEmail } from 'class-validator'

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isEmail(value)) return value
    throw new BadRequestException('Email must be email.')
  }
}
