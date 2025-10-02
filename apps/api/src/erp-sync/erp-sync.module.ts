import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncProcessor } from './sync.processor';
import { SyncController } from './sync.controller';
import { ZettiClient } from './zetti.client';
import { ErpProduct } from './domain/erp_product.entity';
import { ErpSku } from './domain/erp_sku.entity';
import { ErpBranchStock } from './domain/erp_branch_stock.entity';
import { ErpProductImage } from './domain/erp_product_image.entity';
import { QueuesModule } from '../queues/queues.module';

export const ERP_QUEUE = 'erp-products';
export const ERP_DLQ = 'erp-products-dlq';

@Module({
  imports: [
    QueuesModule,
    BullModule.registerQueue(
      { name: ERP_QUEUE },
      { name: ERP_DLQ }
    ),
    TypeOrmModule.forFeature([ErpProduct, ErpSku, ErpBranchStock, ErpProductImage])
  ],
  controllers: [SyncController],
  providers: [ZettiClient, SyncService, SyncProcessor]
})
export class ErpSyncModule {}


