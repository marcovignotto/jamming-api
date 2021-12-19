import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthService } from './auth.service';

import { Request as RequestType } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';

// TDO
import { RequestUserToken, RequestUserData } from '../dto/auth.tdo';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

@Controller(API_VERSION + '/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @desc GET route
   * @path /
   * @private
   * @return get user info based with the token
   */

  @UseGuards(JwtAuthGuard)
  @Get()
  public getUserData(@Request() req) {
    return this.authService.getUserData(req.user);
  }

  /**
   * @desc POST route
   * @path /login
   * @public
   * @return to get a token
   */

  // TODO
  // add type request
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
