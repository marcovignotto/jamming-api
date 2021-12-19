import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import apiVersion from '../../config/apiVersion';
import { JamsService } from './jams.service';

// take the API version i.e. /v1
const API_VERSION = apiVersion();

@Controller(API_VERSION + '/jams')
export class JamsController {
  constructor(private jamsService: JamsService) {}

  /**
   * @desc GET route
   * @path /
   * @private for users
   * @return returns all the current jams
   */

  @Get()
  public getAllJams() {
    return this.jamsService.getAllJams();
  }

  /**
   * @desc POST route
   * @path /
   * @private
   * @return creates a jam
   */
  @Post()
  public postJam() {
    return this.jamsService.postJam();
  }

  /**
   * @desc PUT route
   * @path /:id
   * @private admin / user (owner)
   * @return updates jam
   */

  @Put()
  public updateJam() {
    return this.jamsService.updateJam();
  }

  /**
   * @desc DELETE route
   * @path /:id
   * @private admin / user (owner)
   * @return deletes jam
   */
  @Delete()
  public deleteJam() {
    return this.jamsService.deleteJam();
  }
}
