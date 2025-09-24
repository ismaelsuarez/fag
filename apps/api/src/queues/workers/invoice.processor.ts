import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_INVOICE } from '../queues.module';

@Processor(QUEUE_INVOICE)
export class InvoiceProcessor extends WorkerHost {
  async process() {
    // issueInvoiceJob
  }
}


