import { Controller, Get, Put, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

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
  //   @Post()
  //   public postUser() {
  //     return this.usersService.postUser();
  //   }

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
