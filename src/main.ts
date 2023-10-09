import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { QueryFailedExceptionFilter } from './filters/query-failed-exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter'
import { readFileSync } from 'fs'
import { BasePoemiaErrorFilter } from './filters/base-poemia-error.filter'

async function bootstrap() {
  console.log(process.env.DENEME_LOG)
  const httpsOptions = {
    key: readFileSync(__dirname + '/secrets/poemia.key'),
    cert: readFileSync(__dirname + '/secrets/poemia.crt')
  }
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  })
  app.enableCors()

  app.useGlobalFilters(new QueryFailedExceptionFilter(), new EntityNotFoundExceptionFilter(), new BasePoemiaErrorFilter())
  app.setGlobalPrefix('poemia/api/v1')
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const config = new DocumentBuilder()
    .setTitle('Poemia')
    .setDescription('This Page is the Swagger OpenAPI documentation for Poemia')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .setVersion(require('../package.json').version)
    .addBearerAuth({
      name: 'bearer',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    })
    .addTag('Poemia')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger/api/v1', app, document)

  await app.listen(3000)
}
bootstrap()
