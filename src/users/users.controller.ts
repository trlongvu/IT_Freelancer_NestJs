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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import {
  Public,
  ResponseMessage,
  User as UserDecorator,
} from '../decorators/customize';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, UpdateResult } from 'mongoose';
import { IUser } from './users.interface';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto, @UserDecorator() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Users fetched successfully')
  findAll(@Query() query: FilterUserDto) {
    return this.usersService.findAll(query);
  }

  @Public()
  @Get(':_id')
  @ResponseMessage('Get user successfully')
  findOne(@Param('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Patch(':_id')
  @ResponseMessage('User updated successfully')
  update(
    @Param('_id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() user: IUser,
  ) {
    return this.usersService.update(_id, updateUserDto, user);
  }

  @Delete(':_id')
  @ResponseMessage('User deleted successfully')
  remove(@Param('_id') _id: string, @UserDecorator() user: IUser) {
    return this.usersService.remove(_id, user);
  }
}
