import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { DeleteResult, Model, UpdateResult } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async isValidPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashPass = await this.getHashPassword(createUserDto.password);
    return this.userModel.create({
      ...createUserDto,
      password: hashPass,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(_id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    _id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }
    const user_update = await this.userModel.updateOne(
      { _id },
      { ...updateUserDto, updatedAt: new Date() },
    );
    if (!user_update.modifiedCount) {
      throw new NotFoundException('User not found');
    }
    return user_update;
  }
  async remove(_id: string): Promise<DeleteResult> {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }
    const user_delete = await this.userModel.deleteOne({ _id });
    if (!user_delete.deletedCount) {
      throw new NotFoundException('User not found');
    }
    return user_delete;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean();
  }
}
