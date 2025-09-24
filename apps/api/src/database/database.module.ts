import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isTest = config.get('NODE_ENV') === 'test';
        if (isTest) {
          return {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [__dirname + '/../**/*.entity.{ts,js}'],
            synchronize: true
          } as any;
        }
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: parseInt(config.get('DB_PORT') ?? '5432', 10),
          username: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
          synchronize: false,
          autoLoadEntities: true
        } as any;
      }
    })
  ]
})
export class DatabaseModule {}


