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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ResponseMessage,
  User as UserDecorator,
} from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { FilterRoleDto } from './dto/filter-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Role created successfully')
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @UserDecorator() user: IUser,
  ) {
    const role = await this.rolesService.create(createRoleDto, user);
    return {
      _id: role._id,
      createdAt: role.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Roles retrieved successfully')
  findAll(@Query() query: FilterRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':_id')
  @ResponseMessage('Role retrieved successfully')
  findOne(@Param('_id') _id: string) {
    return this.rolesService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('Role updated successfully')
  async update(
    @Param('_id') _id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @UserDecorator() user: IUser,
  ) {
    const role = await this.rolesService.update(_id, updateRoleDto, user);
    return {
      _id: role._id,
      updatedAt: role.updatedAt,
    };
  }

  @Delete(':_id')
  @ResponseMessage('Role deleted successfully')
  async remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    const role = await this.rolesService.remove(_id, user);
    return {
      _id: role._id,
      deletedAt: role.deletedAt,
    };
  }
}
