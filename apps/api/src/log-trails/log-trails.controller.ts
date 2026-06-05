import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogsService } from './log-trails.service';
import { CreateLogTrailDto } from './dto/create-log-trail.dto';

@ApiTags('Audit Logs System Engine')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Write a structural tracking transaction event into persistent system logging frameworks' })
  @ApiResponse({ status: 201, description: 'Event trace logged successfully.' })
  create(@Body() createLogTrailDto: CreateLogTrailDto) {
    return this.logsService.create(createLogTrailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch timeline streams across all architectural execution activities' })
  findAll(
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const takeValue = limit ? parseInt(limit, 10) : 100;
    const skipValue = skip ? parseInt(skip, 10) : 0;
    return this.logsService.findAll(takeValue, skipValue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Inspect operational properties tied to single transaction tracing records' })
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Isolate actions history timelines associated to targeted account user entities primary keys' })
  findByUser(@Param('userId') userId: string) {
    return this.logsService.findByUserId(userId);
  }
}