import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from '../dto/user.dto';

import apiVersion from '../../config/apiVersion';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

@Controller(API_VERSION + '/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * @desc GET route
   * @path /
   * @private for admin
   * @return returns all the users
   */

  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * @desc POST route
   * @path /
   * @public
   * @return creates a user
   */
  @Public()
  @Post()
  public postUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.postUser(createUserDto);
  }

  /**
   * @desc PUT route
   * @path /:id
   * @private admin / user (owner)
   * @return updates user
   */

  @Put(':id')
  public updateUser(
    @Body() updateUserDto: CreateUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * @desc DELETE route
   * @path /:id
   * @private admin / user (owner)
   * @return deletes user
   */
  @UseGuards(JwtAuthGuard) // needed to get user's email and check the owner or admin
  @Delete(':id')
  public deleteUser(@Param('id') id: string, @Request() req) {
    // forward user id and user data
    return this.usersService.deleteUser(id, req.user);
  }
}
