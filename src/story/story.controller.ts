import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { StoryService } from './story.service'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Story } from './entity/story.entity'
import { CurrentUser } from 'src/decorators/decorators'
import { User } from 'src/auth/user/entity/user.entity'
import { CreateStoryDto } from './dto/create-story.dto'
import { ApiOkResponsePaginated } from 'src/sdk/swagger-helper/api-ok-response-paginated'
import { StoryViewService } from './story-view/story-view.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Controller('story')
@ApiTags('story')
@ApiNotFoundResponse({
  description: 'Given Entity Not Found'
})
export class StoryController {
  constructor(
    @InjectQueue('view') private readonly viewQueue: Queue,
    private readonly storyService: StoryService,
    private readonly storyViewService: StoryViewService
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiCreatedResponse({
    description: 'Use this to create a post in draft mode. if you sent isDraft flag false. It will be immediately published.',
    type: Story
  })
  public async createStory(@Body() createStoryDto: CreateStoryDto, @CurrentUser() user: User): Promise<Story> {
    return await this.storyService.createStory(createStoryDto, user)
  }

  @Get('/all')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  @ApiOkResponsePaginated(Story)
  public async getAllPostsByPagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @CurrentUser() user: User
  ) {
    return await this.storyService.getStoriesWithEm(page, size, user)
  }

  @Post('/view/:id')
  @ApiUnauthorizedResponse({
    description: 'Authentication required. In order for user to see the post. It has to registered with a email.'
  })
  public async viewStory(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.viewQueue.add('story', { storyId: id, user }, { removeOnComplete: true })
  }
}
