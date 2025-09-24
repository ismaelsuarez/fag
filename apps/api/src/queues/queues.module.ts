import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatalogProcessor } from './workers/catalog.processor';
import { StockProcessor } from './workers/stock.processor';
import { InvoiceProcessor } from './workers/invoice.processor';
import { NotificationProcessor } from './workers/notification.processor';

export const QUEUE_CATALOG = 'catalog';
export const QUEUE_STOCK = 'stock';
export const QUEUE_INVOICE = 'invoice';
export const QUEUE_NOTIFICATION = 'notification';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST') ?? '127.0.0.1',
          port: parseInt(config.get('REDIS_PORT') ?? '6379', 10)
        }
      })
    }),
    BullModule.registerQueue({ name: QUEUE_CATALOG }, { name: QUEUE_STOCK }, { name: QUEUE_INVOICE }, { name: QUEUE_NOTIFICATION })
  ],
  providers: [CatalogProcessor, StockProcessor, InvoiceProcessor, NotificationProcessor],
  exports: [BullModule]
})
export class QueuesModule {}


