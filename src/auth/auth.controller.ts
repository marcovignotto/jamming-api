import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Req,
  Query,
  Param,
} from '@nestjs/common';

import { RequestUserDataDto, RequestUserToken } from '../dto/auth.dto';

import { ApiBody, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
  // @UseGuards(JwtAuthGuard) // returns user email
  @Get()
  public getUserData(
    @Request() req: RequestUserToken | RequestUserDataDto,
  ): Promise<object> {
    //TODO
    console.log(req);
    return this.authService.getUserData(req);
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
