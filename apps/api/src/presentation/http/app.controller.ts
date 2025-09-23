import { Controller, Get } from '@nestjs/common';

import { AppService } from '../../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return { status: 'ok', ts: Date.now() };
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}


