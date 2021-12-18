import { Controller, Get, Put, Post, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from '../dto/createUser.dto';

@Controller('users')
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

  //   @Put(':id')
  //   public updateUser() {
  //     return this.usersService.updateUser();
  //   }

  /**
   * @desc DELETE route
   * @path /:id
   * @private admin / user (owner)
   * @return deletes user
   */

  //   @Delete(':id')
  //   public deleteUser() {
  //     return this.usersService.deleteUser();
  //   }
}
