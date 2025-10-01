import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ERP_QUEUE } from './erp-sync.module';
import { ZettiClient } from './zetti.client';

const syncSchema = z.object({
  mode: z.enum(['full', 'incremental']),
  groups: z.array(z.number()).optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

@Controller('erp')
export class SyncController {
  constructor(@InjectQueue(ERP_QUEUE) private readonly queue: Queue, private readonly zetti: ZettiClient) {}

  @Post('sync/products')
  async syncProducts(@Body(new ZodValidationPipe(syncSchema)) body: z.infer<typeof syncSchema>) {
    if (body.mode === 'full') {
      await this.queue.add('sync:full', { mode: 'full', groups: body.groups ?? String(process.env.ZETTI_GROUP_IDS ?? '2').split(',').map((x) => Number(x.trim())) }, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
    } else {
      await this.queue.add('sync:incremental', { mode: 'incremental', from: body.from!, to: body.to! }, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
    }
    return { enqueued: true };
  }

  @Get('health')
  async health() {
    const about = await this.zetti.about();
    return { ok: true, about };
  }

  @Get('permissions/:nodeId')
  permissions(@Param('nodeId') nodeId: string) {
    return this.zetti.userPermissions(nodeId);
  }
}


