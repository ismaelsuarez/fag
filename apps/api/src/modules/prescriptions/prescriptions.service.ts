import { Injectable } from '@nestjs/common';

@Injectable()
export class PrescriptionsService {
  upload(fileUrl: string) {
    return { id: 'rx-123', fileUrl, status: 'pending' as const };
  }
}


