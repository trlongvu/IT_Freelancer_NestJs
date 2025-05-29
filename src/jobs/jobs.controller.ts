import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import {
  Public,
  ResponseMessage,
  User as UserDecorator,
} from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { FilterJobDto } from './dto/filter-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Job created successfully')
  async create(
    @Body() createJobDto: CreateJobDto,
    @UserDecorator() user: IUser,
  ) {
    const job = await this.jobsService.create(createJobDto, user);
    return {
      _id: job._id,
      createdAt: job.createdAt,
    };
  }

  @Get('by-hr')
  @ResponseMessage('Get list jobs successfully')
  findJobsByHr(@Query() query: FilterJobDto, @UserDecorator() user: IUser) {
    return this.jobsService.findJobsByHr(query, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get list jobs successfully')
  findAll(@Query() query: FilterJobDto) {
    return this.jobsService.findAll(query);
  }

  @Public()
  @Get(':_id')
  @ResponseMessage('Get job successfully')
  findOne(@Param('_id') _id: string) {
    return this.jobsService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('Job updated successfully')
  async update(
    @Param('_id') _id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UserDecorator() user: IUser,
  ) {
    const job = await this.jobsService.update(_id, updateJobDto, user);
    return {
      _id: job._id,
      updatedAt: job.updatedAt,
    };
  }

  @Delete(':_id')
  @ResponseMessage('Job deleted successfully')
  async remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    const job = await this.jobsService.remove(_id, user);
    return {
      _id: job._id,
      deletedAt: job.deletedAt,
    };
  }
}
