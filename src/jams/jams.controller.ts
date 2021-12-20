import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import apiVersion from '../../config/apiVersion';
import { JamsService } from './jams.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// tdo
import { CreateJamDto, UrlJam } from '../dto/jam.dto';

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
  @UseGuards(JwtAuthGuard) // needed to get user's email
  @Get()
  public getAllJams(@Query('all') all, @Request() req) {
    // forward query all and email
    // to return all the values or jsut the matching bassed on the user

    return this.jamsService.getAllJams(all, req.user);
  }

  /**
   * @desc POST route
   * @path /
   * @private
   * @return creates a jam
   */

  // TODO
  // ??? problem DTO
  @Post()
  public postJam(@Body() createJamDto: CreateJamDto | any) {
    return this.jamsService.postJam(createJamDto);
  }

  /**
   * @desc PUT route
   * @path /:url
   * @private admin / user (owner)
   * @return updates jam
   */
  @UseGuards(JwtAuthGuard) // needed to get user's email
  @Put(':url')
  public updateJam(@Param('url') url: UrlJam, @Request() req) {
    // forward the url to the func
    return this.jamsService.updateJam(url, req.user);
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
