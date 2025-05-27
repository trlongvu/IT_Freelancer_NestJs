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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ResponseMessage,
  User as UserDecorator,
} from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { FilterPermissionDto } from './dto/filter-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Permission created successfully')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @UserDecorator() user: IUser,
  ) {
    const permission = await this.permissionsService.create(
      createPermissionDto,
      user,
    );
    return {
      _id: permission._id,
      createdAt: permission.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Get all permissions successfully')
  findAll(@Query() query: FilterPermissionDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':_id')
  @ResponseMessage('Get permission successfully')
  findOne(@Param('_id') _id: string) {
    return this.permissionsService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('Permission updated successfully')
  async update(
    @Param('_id') _id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @UserDecorator() user: IUser,
  ) {
    const permission = await this.permissionsService.update(
      _id,
      updatePermissionDto,
      user,
    );
    return {
      _id: permission._id,
      updatedAt: permission.updatedAt,
    };
  }

  @Delete(':_id')
  @ResponseMessage('Permission deleted successfully')
  async remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    const permission = await this.permissionsService.remove(_id, user);
    return {
      _id: permission._id,
      deletedAt: permission.deletedAt,
    };
  }
}
