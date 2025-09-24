import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { PrescriptionsService } from './prescriptions.service';

const uploadSchema = z.object({ fileUrl: z.string().url() });

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly service: PrescriptionsService) {}

  @Post('upload')
  upload(@Body(new ZodValidationPipe(uploadSchema)) body: z.infer<typeof uploadSchema>) {
    return this.service.upload(body.fileUrl);
  }
}


