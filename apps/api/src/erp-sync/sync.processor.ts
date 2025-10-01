import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ERP_DLQ, ERP_QUEUE } from './erp-sync.module';
import { SyncService } from './sync.service';

type SyncPayload =
  | { mode: 'full'; groups: number[] }
  | { mode: 'incremental'; from: string; to: string };

@Injectable()
@Processor(ERP_QUEUE, { concurrency: 1 })
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);
  constructor(private readonly sync: SyncService, @InjectQueue(ERP_DLQ) private readonly dlq: Queue) {
    super();
  }

  async process(job: Job<SyncPayload>): Promise<void> {
    try {
      if (job.name === 'sync:full') {
        const p = job.data as Extract<SyncPayload, { mode: 'full' }>;
        await this.sync.fullLoadByGroups(p.groups);
      } else if (job.name === 'sync:incremental') {
        const p = job.data as Extract<SyncPayload, { mode: 'incremental' }>;
        await this.sync.incrementalByDates(p.from, p.to);
      } else {
        this.logger.warn(`Unknown job: ${job.name}`);
      }
    } catch (err: any) {
      this.logger.error(`Job failed: ${job.name}`, err?.stack || String(err));
      await this.dlq.add(job.name, { ...job.data, lastError: String(err) });
      throw err; // para respetar reintentos/backoff
    }
  }
}


