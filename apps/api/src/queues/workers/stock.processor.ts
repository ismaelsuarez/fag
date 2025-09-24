import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_STOCK } from '../queues.module';

@Processor(QUEUE_STOCK)
export class StockProcessor extends WorkerHost {
  async process() {
    // syncStockJob
  }
}


