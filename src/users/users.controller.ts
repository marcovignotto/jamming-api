import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';

import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

// auth middleware
import { Public } from '../decorators/public.decorator';

import { UsersService } from './users.service';

// DTOs
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

import apiVersion from '../../config/apiVersion';
import { User } from 'src/schemas/user.schema';

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
  // docs
  @ApiTags('users')
  @ApiOperation({ summary: 'To get all the users' })
  @ApiResponse({
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  //route
  @Get()
  public getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  /**
   * @desc POST route
   * @path /
   * @public
   * @return creates a user
   */
  // docs
  @ApiTags('users')
  @ApiOperation({ summary: 'To create a user' })
  @ApiResponse({
    type: UpdateUserDto,
    status: 201,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })
  @ApiResponse({ status: 409, description: 'Email already registered!' })

  // route
  @Public()
  @Post()
  public postUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.postUser(createUserDto);
  }

  /**
   * @desc PUT route
   * @path /:id
   * @private admin / user (owner)
   * @return updates user
   */
  // docs
  @ApiTags('users')
  @ApiOperation({ summary: 'To update a users' })
  @ApiResponse({
    type: UpdateUserDto,
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // route
  @Put(':id')
  public updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * @desc DELETE route
   * @path /:id
   * @private admin / user (owner)
   * @return deletes user
   */
  // docs
  @ApiTags('users')
  @ApiOperation({ summary: 'To delete a users' })
  @ApiResponse({
    status: 200,
    description: 'User John Doe deleted!',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // route
  @Delete(':id')
  public deleteUser(@Param('id') id: string, @Request() req): Promise<string> {
    // forward user id and user data
    return this.usersService.deleteUser(id, req.user);
  }
}
