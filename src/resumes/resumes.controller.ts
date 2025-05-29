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
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import {
  ResponseMessage,
  User as UserDecorator,
} from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { FilterResumeDto } from './dto/filter-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get('by-user')
  @ResponseMessage('Get CV applied successfully')
  getCvByUser(@UserDecorator() user: IUser) {
    return this.resumesService.getCvByUser(user);
  }

  @Get('by-hr/:jobId')
  @ResponseMessage('Get CV by HR successfully')
  getCvByHr(
    @Query() query: FilterResumeDto,
    @Param('jobId') jobId: string,
    @UserDecorator() user: IUser,
  ) {
    return this.resumesService.getCvByHr(query, jobId, user);
  }

  @Post()
  @ResponseMessage('Resume created successfully')
  async create(
    @Body() createResumeDto: CreateResumeDto,
    @UserDecorator() user: IUser,
  ) {
    const resume = await this.resumesService.create(createResumeDto, user);
    return {
      _id: resume._id,
      createdAt: resume.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Resumes retrieved successfully')
  findAll(@Query() query: FilterResumeDto) {
    return this.resumesService.findAll(query);
  }

  @Get(':_id')
  @ResponseMessage('Resume retrieved successfully')
  findOne(@Param('_id') _id: string) {
    return this.resumesService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('Resume updated successfully')
  async update(
    @Param('_id') _id: string,
    @Body('status') status: string,
    @UserDecorator() user: IUser,
  ) {
    const resume = await this.resumesService.update(_id, status, user);
    return {
      _id: resume._id,
      updatedAt: resume.updatedAt,
    };
  }

  @Delete(':_id')
  @ResponseMessage('Resume removed successfully')
  async remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    const resume = await this.resumesService.remove(_id, user);
    return {
      _id: resume._id,
      deletedAt: resume.deletedAt,
    };
  }
}
