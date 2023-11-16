import { OmitType, PartialType } from '@nestjs/swagger'
import { Story } from '../entity/story.entity'

export class CreateStoryDto extends PartialType(OmitType(Story, ['id', 'createdAt', 'updatedAt', 'expiresAt', 'user', 'views'])) {}
