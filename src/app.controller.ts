import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from './app.service';

// take the API version i.e. /v1
const API_VERSION = '/v1';

@Controller(API_VERSION)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
