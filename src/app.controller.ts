import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from './decorators/public.decorator';

import { AppService } from './app.service';

import apiVersion from '../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

// exclude from swagger
@ApiExcludeController()
@Controller(API_VERSION)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
