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

import {
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// auth middleware
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

import { UsersService } from './users.service';

// DTOs
import { CreateUserDto, PromiseCreateUserDto } from '../dto/user.dto';

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
  public getAllUsers() {
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
    type: PromiseCreateUserDto,
    status: 201,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })
  @ApiResponse({ status: 409, description: 'Email already registered!' })

  // route
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
  // docs
  @ApiTags('users')
  @ApiOperation({ summary: 'To update a users' })
  @ApiResponse({
    type: PromiseCreateUserDto,
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // route
  @Put(':id')
  public updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
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
  @UseGuards(JwtAuthGuard) // needed to get user's email and check the owner or admin
  @Delete(':id')
  public deleteUser(@Param('id') id: string, @Request() req) {
    // forward user id and user data
    return this.usersService.deleteUser(id, req.user);
  }
}
