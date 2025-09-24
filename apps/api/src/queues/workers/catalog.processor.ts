import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_CATALOG } from '../queues.module';

@Processor(QUEUE_CATALOG)
export class CatalogProcessor extends WorkerHost {
  async process() {
    // syncCatalogJob
  }
}


