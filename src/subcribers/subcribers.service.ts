import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from './schemas/subcriber.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { FilterSubcriberDto } from './dto/filter-subcriber.dto';

@Injectable()
export class SubcribersService {
  constructor(
    @InjectModel(Subcriber.name)
    private subcriberModel: Model<SubcriberDocument>,
  ) {}

  async create(createSubcriberDto: CreateSubcriberDto, user: IUser) {
    const { email } = createSubcriberDto;
    const subcriberExist = await this.subcriberModel.findOne({
      email,
      isDeleted: false,
    });
    if (subcriberExist) {
      throw new ConflictException('Email already exists');
    }
    return await this.subcriberModel.create({
      ...createSubcriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: FilterSubcriberDto) {
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
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total_items = await this.subcriberModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);
    const result = await this.subcriberModel
      .find(filter)
      .skip(offset)
      .limit(items_per_page)
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
      throw new BadRequestException('Invalid subcriber ID');
    }
    const subcriber = await this.subcriberModel.findOne({
      _id,
      isDeleted: false,
    });
    if (!subcriber) {
      throw new NotFoundException('Subcriber not found');
    }
    return subcriber;
  }

  async update(updateSubcriberDto: UpdateSubcriberDto, user: IUser) {
    const subcriber = await this.subcriberModel.findOneAndUpdate(
      {
        email: user.email,
        isDeleted: false,
      },
      {
        ...updateSubcriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true, upsert: true },
    );

    if (!subcriber) {
      throw new NotFoundException('Subcriber not found');
    }
    return subcriber;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid subcriber ID');
    }

    const subcriber = await this.subcriberModel.findOneAndUpdate(
      {
        _id,
        isDeleted: false,
      },
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

    if (!subcriber) {
      throw new NotFoundException('Subcriber not found');
    }
    return subcriber;
  }

  findSubcriberToSendEmail() {
    return this.subcriberModel.find({ isDeleted: false }).lean();
  }

  async getSkills(user: IUser) {
    return await this.subcriberModel
      .findOne({ email: user.email, isDeleted: false }, { skills: 1 })
      .lean();
  }
}
