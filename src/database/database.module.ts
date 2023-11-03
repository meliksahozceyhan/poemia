import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { readFileSync } from 'fs'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        schema: configService.get('database.schema'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        poolSize: 100,
        extra: {
          ssl:
            process.env.DENEME_LOG === 'dev'
              ? false
              : {
                  ca: readFileSync(__dirname + '/crt/eu-central-1-bundle.pem').toString()
                },
          poolSize: 100
        }
      })
    })
  ]
})
export class DatabaseModule {}
