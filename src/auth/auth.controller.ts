import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';

import { RequestUserDataDto, RequestUserToken } from '../dto/auth.dto';

import { ApiBody, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../decorators/public.decorator';

import { AuthService } from './auth.service';

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
  // docs
  @ApiTags('auth')
  @ApiOperation({ summary: 'To get user data with the token' })
  @ApiBody({ type: RequestUserDataDto })
  @ApiResponse({
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // route
  @Get()
  async getUserData(@Request() req): Promise<object> {
    // req.user is field by the guard that decodes the token
    // and returns the email
    return this.authService.getUserData(req.user);
  }

  /**
   * @desc POST route
   * @path /login
   * @public
   * @return to get a token
   */

  // docs
  @ApiTags('auth')
  @ApiOperation({ summary: 'To login and get a token' })
  @ApiBody({ type: RequestUserToken })
  @ApiResponse({
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })

  // Route
  @Public() // to make it accesible
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestUserToken) {
    return this.authService.login(req);
  }
}
