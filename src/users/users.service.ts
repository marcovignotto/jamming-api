import { Injectable } from '@nestjs/common';

// interfaces

export interface PostUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userCode: string;
  instruments: string[];
  role: string;
}

export interface PostUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  instruments: string[];
  role: string;
}

export interface DeleteUserResponse {
  deleteConfirmation: string;
}

@Injectable()
export class UsersService {
  public getAllUsers(): string[] {
    return [];
  }

  /**
   * @function postUser
   * @desc ot post a user
   * @returns obj witrh the created user
   */

  public postUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instruments: string[],
    role: string,
  ): PostUserResponse {
    const objToReturn = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userCode: '009',
      instruments: instruments,
      role: role,
    };

    return objToReturn;
  }

  /**
   * @function updateUser
   * @desc to update a user
   * @returns obj with the updated user
   */

  public updateUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instruments: string[],
    role: string,
  ): PostUserResponse {
    const objToReturn = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userCode: '009',
      instruments: instruments,
      role: role,
    };

    return objToReturn;
  }

  /**
   * @function deleteUser
   * @desc to delete a user
   * @returns obj with the deleted user
   */

  public deleteUser(firstName: string, lastName: string, id: string) {
    const deleteConfirmation = `User ${firstName} ${lastName} with the id ${id} deleted`;

    return deleteConfirmation;
  }
}
