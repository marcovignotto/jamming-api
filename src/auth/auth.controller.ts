import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

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

  @UseGuards(AuthGuard('local'))
  @Get()
  public getUserData(@Body() bodyUserData: RequestUserData) {
    return this.authService.getUserData(bodyUserData);
  }

  /**
   * @desc POST route
   * @path /login
   * @public
   * @return to get a token
   */

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public postToGetToken(@Body() bodyUserToken: RequestUserToken) {
    return this.authService.postToGetToken(bodyUserToken);
  }
}
