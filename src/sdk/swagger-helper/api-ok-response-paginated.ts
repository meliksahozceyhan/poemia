import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PageResponse } from '../PageResponse'

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(PageResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResponse) },
          {
            properties: {
              content: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) }
              }
            }
          }
        ]
      },
      description: `Returns the pagination details and List of the ${dataDto.name} entities`
    })
  )
