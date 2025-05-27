import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { FilterRoleDto } from './dto/filter-role.dto';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const role = await this.roleModel.findOne({
      name: createRoleDto.name,
      isDeleted: false,
    });
    if (role) {
      throw new ConflictException('Role already exists');
    }
    return await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: FilterRoleDto) {
    const { search } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: { isDeleted: boolean; $or: any[] } = {
      isDeleted: false,
      $or: [],
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total_items = await this.roleModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(items_per_page)
      .populate('permissions', '_id name method apiPath module')
      .sort({ createdAt: -1 })
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
      throw new BadRequestException('Invalid role ID');
    }

    const role = await this.roleModel
      .findOne({ _id, isDeleted: false })
      .populate('permissions', '_id name method apiPath module')
      .lean()
      .exec();

    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid role ID');
    }

    if (updateRoleDto.name) {
      const existingRole = await this.roleModel.findOne({
        _id: { $ne: _id },
        name: updateRoleDto.name,
        isDeleted: false,
      });
      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    const role = await this.roleModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid role ID');
    }

    const roleAdmin = await this.roleModel.findOne({ _id, isDeleted: false });
    if (roleAdmin?.name === ADMIN_ROLE) {
      throw new ConflictException('Cannot delete Admin role');
    }

    const role = await this.roleModel.findOneAndUpdate(
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
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
