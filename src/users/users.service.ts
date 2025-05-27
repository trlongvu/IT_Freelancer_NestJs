import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from './users.interface';
import { FilterUserDto } from './dto/filter-user.dto';
import { ConfigService } from '@nestjs/config';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,

    private configService: ConfigService,
  ) {}

  async getHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async isValidPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto, user_decorator: IUser) {
    const user = await this.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const userRole = await this.roleModel.findOne({
      name: USER_ROLE,
      isDeleted: false,
    });
    const hashPass = await this.getHashPassword(createUserDto.password);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
      role: userRole?._id,
      createdBy: {
        _id: user_decorator._id,
        email: user_decorator.email,
      },
    });
    return {
      _id: newUser._id,
      createdBy: newUser.createdBy,
    };
  }

  async findAll(query: FilterUserDto) {
    const { search } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: {
      isDeleted: boolean;
      $or: any[];
      // address: {}
    } = {
      isDeleted: false,
      $or: [],
      // address: {},
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // if (address) {
    //   filter.address = { $regex: address, $options: 'i' };
    // }

    const total_items = await this.userModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.userModel
      .find(filter, { password: 0 })
      .skip(offset)
      .limit(items_per_page)
      .sort({ createdAt: -1 })
      .populate('role', '_id name')
      .lean()
      .exec();

    return {
      metadata: {
        current: current_page,
        page_size: items_per_page,
        pages: total_pages,
        total: total_items,
      },
      result,
    };
  }

  async findOne(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel
      .findById(_id, { password: 0 })
      .populate('role', '_id name')
      .lean();
    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    _id: string,
    updateUserDto: UpdateUserDto,
    user_decorator: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }
    const user_update = await this.userModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user_decorator._id,
          email: user_decorator.email,
        },
      },
      { new: true },
    );
    if (!user_update) {
      throw new NotFoundException('User not found');
    }
    return user_update;
  }
  async remove(_id: string, user_decorator: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }

    const userAdmin = await this.userModel.findOne({
      _id,
      isDeleted: false,
    });
    if (userAdmin?.email === this.configService.get<string>('EMAIL_ADMIN')) {
      throw new BadRequestException(
        'You cannot delete the admin user. Please contact support.',
      );
    }

    const user_delete = await this.userModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: {
          _id: user_decorator._id,
          email: user_decorator.email,
        },
      },
      { new: true },
    );
    if (!user_delete) {
      throw new NotFoundException('User not found');
    }
    return user_delete;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('role', 'name').lean();
  }

  updateUserToken = async (_id: string, refresh_token: string) => {
    return await this.userModel.updateOne(
      { _id, isDeleted: false },
      {
        $set: {
          refreshToken: refresh_token,
        },
      },
    );
  };

  findUserByToken = (refresh_token: string) => {
    return this.userModel
      .findOne(
        {
          refreshToken: refresh_token,
          isDeleted: false,
        },
        { password: 0 },
      )
      .populate('role', 'name')
      .lean();
  };
}
