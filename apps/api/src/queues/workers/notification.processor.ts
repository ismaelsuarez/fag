import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATION } from '../queues.module';

@Processor(QUEUE_NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  async process() {
    // notifyOrderJob
  }
}


