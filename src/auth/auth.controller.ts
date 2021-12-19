import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

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
  // TODO
  @Get()
  public getUserData(@Body() bodyUserData: RequestUserData) {
    return this.authService.getUserData(bodyUserData);
  }

  /**
   * @desc POST route
   * @path /
   * @public
   * @return to get a token
   */

  @Post()
  public postToGetToken(@Body() bodyUserToken: RequestUserToken) {
    return this.authService.postToGetToken(bodyUserToken);
  }
}
