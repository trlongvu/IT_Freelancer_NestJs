import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import mongoose, { Model } from 'mongoose';
import { FilterPermissionDto } from './dto/filter-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const PermissionExists = await this.permissionModel.findOne({
      apiPath,
      method,
      isDeleted: false,
    });

    if (PermissionExists) {
      throw new ConflictException('Permission already exists');
    }

    return await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: FilterPermissionDto) {
    const { search, method } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: { isDeleted: boolean; $or: any[]; method?: any } = {
      isDeleted: false,
      $or: [],
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { module: { $regex: search, $options: 'i' } },
      ];
    }

    if (method) {
      filter.method = method;
    }

    const total_items = await this.permissionModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);
    const result = await this.permissionModel
      .find(filter)
      .skip(offset)
      .limit(items_per_page)
      .sort({ createdAt: -1 })
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
      throw new BadRequestException('Invalid permission id');
    }
    const permission = await this.permissionModel.findOne({
      _id,
      isDeleted: false,
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async update(
    _id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid permission id');
    }

    const permission = await this.permissionModel.findOne({
      _id,
      isDeleted: false,
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const permissionExists = await this.permissionModel.findOne({
      apiPath: updatePermissionDto.apiPath || permission.apiPath,
      method: updatePermissionDto.method || permission.method,
      isDeleted: false,
      _id: { $ne: _id },
    });

    if (permissionExists) {
      throw new ConflictException(
        'Permission with this API path and method already exists',
      );
    }

    const permissionUpdate = await this.permissionModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      {
        new: true,
      },
    );
    if (!permissionUpdate) {
      throw new NotFoundException('Permission not found');
    }
    return permissionUpdate;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid permission id');
    }
    const permission = await this.permissionModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
}
