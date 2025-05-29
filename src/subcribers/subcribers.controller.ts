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
import { SubcribersService } from './subcribers.service';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import {
  ResponseMessage,
  SkipCheckPermission,
  User as UserDecorator,
} from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { FilterSubcriberDto } from './dto/filter-subcriber.dto';

@Controller('subcribers')
export class SubcribersController {
  constructor(private readonly subcribersService: SubcribersService) {}

  @SkipCheckPermission()
  @Post('skills')
  @ResponseMessage('Skills retrieved successfully')
  getUserSkills(@UserDecorator() user: IUser) {
    return this.subcribersService.getSkills(user);
  }

  @Post()
  async create(
    @Body() createSubcriberDto: CreateSubcriberDto,
    @UserDecorator() user: IUser,
  ) {
    const subcriber = await this.subcribersService.create(
      createSubcriberDto,
      user,
    );
    return {
      _id: subcriber._id,
      createdAt: subcriber.createdAt,
    };
  }

  @Get()
  findAll(@Query() query: FilterSubcriberDto) {
    return this.subcribersService.findAll(query);
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.subcribersService.findOne(_id);
  }

  @SkipCheckPermission()
  @Patch()
  async update(
    @Body() updateSubcriberDto: UpdateSubcriberDto,
    @UserDecorator() user: IUser,
  ) {
    const subcriber = await this.subcribersService.update(
      updateSubcriberDto,
      user,
    );
    return {
      _id: subcriber._id,
      updatedAt: subcriber.updatedAt,
    };
  }

  @Delete(':_id')
  async remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    const subcriber = await this.subcribersService.remove(_id, user);
    return {
      _id: subcriber._id,
      deletedAt: subcriber.deletedAt,
    };
  }
}
