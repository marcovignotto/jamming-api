import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';

import {
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JamsService } from './jams.service';

// tdo
import { CreateJamDto } from '../dto/jam.dto';

import apiVersion from '../../config/apiVersion';

import { Jam } from '../schemas/jam.schema';

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
  // docs
  @ApiTags('jams')
  @ApiOperation({ summary: 'To get all the jams' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  @ApiResponse({
    type: [CreateJamDto],
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  //route
  @Get()
  public getAllJams(
    @Query('all') all: boolean,
    @Request() req,
  ): Promise<Jam[]> {
    // req.user is field by the guard that decodes the token and returns the email
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
  // Docs
  @ApiTags('jams')
  @ApiOperation({ summary: 'To create a jam' })
  @ApiBody({
    type: CreateJamDto,
  })
  @ApiResponse({
    type: Jam,
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 400, description: 'Jam name already exists' })
  @ApiResponse({ status: 400, description: 'Jam url already exists' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // Route
  @Post()
  public postJam(@Body() createJamDto: CreateJamDto | any): Promise<Jam> {
    return this.jamsService.postJam(createJamDto);
  }

  /**
   * @desc PUT route
   * @path /:url
   * @private admin / user (owner)
   * @return updates/join a jam
   */
  // Docs
  @ApiTags('jams')
  @ApiOperation({ summary: 'To join a jam' })
  @ApiParam({
    name: 'url indentifier',
    required: true,
    description: 'The unique url of the jam',
    example: 'jam-with-me',
  })
  @ApiBody({
    type: CreateJamDto,
  })
  @ApiResponse({
    type: CreateJamDto,
    status: 200,
    description: 'Access to the route',
  })
  @ApiResponse({ status: 400, description: 'Jam name already exists' })
  @ApiResponse({ status: 400, description: 'Jam url already exists' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // Route
  @Put(':url')
  public updateJam(@Param('url') url: string, @Request() req): Promise<Jam> {
    // req.user is field by the guard that decodes the token and returns the email
    // forward the url to the func
    return this.jamsService.updateJam(url, req.user);
  }

  /**
   * @desc DELETE route
   * @path /:id
   * @private admin / user (owner)
   * @return deletes jam
   */
  // Docs
  @ApiTags('jams')
  @ApiOperation({ summary: 'To delete a jam' })
  @ApiParam({
    name: 'url indentifier',
    required: true,
    description: 'The unique url of the jam',
    example: 'jam-with-me',
  })
  @ApiResponse({
    status: 200,
    description: 'John Doe deleted the jam Jam with me',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials!' })

  // Route
  @Delete(':url')
  public deleteJam(@Param('url') url: string, @Request() req): Promise<string> {
    // req.user is field by the guard that decodes the token and returns the email
    return this.jamsService.deleteJam(url, req.user);
  }
}
