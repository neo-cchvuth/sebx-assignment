import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './auth/jwt.strategy';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getWelcome(): string {
    return this.appService.getWelcome();
  }
}
