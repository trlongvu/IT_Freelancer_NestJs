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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './schemas/company.schema';
import { ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { UpdateResult } from 'mongoose';
import { FilterCompanyDto } from './dto/filter-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ): Promise<Company> {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @ResponseMessage('Get companies successfully')
  findAll(@Query() query: FilterCompanyDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':_id')
  @ResponseMessage('Get company successfully')
  findOne(@Param('_id') _id: string): Promise<Company> {
    return this.companiesService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('Update company successfully')
  update(
    @Param('_id') _id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ): Promise<UpdateResult> {
    return this.companiesService.update(_id, updateCompanyDto, user);
  }

  @Delete(':_id')
  @ResponseMessage('Delete company successfully')
  remove(
    @Param('_id') _id: string,
    @User() user: IUser,
  ): Promise<UpdateResult> {
    return this.companiesService.remove(_id, user);
  }
}
