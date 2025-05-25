import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas/job.schema';
import mongoose, { Model } from 'mongoose';
import { FilterJobDto } from './dto/filter-job.dto';
import dayjs from 'dayjs';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const startDate = dayjs(createJobDto.startDate);
    const endDate = dayjs(createJobDto.endDate);

    if (startDate.isAfter(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    return await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
  }

  async findAll(query: FilterJobDto) {
    const { search, location } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: { isDeleted: boolean; $or: any[]; location?: any } = {
      isDeleted: false,
      $or: [],
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const total_items = await this.jobModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.jobModel
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
      throw new BadRequestException('Invalid job id');
    }
    const job = await this.jobModel.findOne({ _id, isDeleted: false });
    if (!job) {
      throw new BadRequestException('Job not found');
    }
    return job;
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid job id');
    }

    const job_update = await this.jobModel.findOneAndUpdate(
      {
        _id,
        isDeleted: false,
      },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          name: user.name,
        },
      },
      {
        new: true,
      },
    );
    if (!job_update) {
      throw new BadRequestException('Job not found');
    }
    return job_update;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid job id');
    }
    const job = await this.jobModel.findOneAndUpdate(
      {
        _id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      },
      { new: true },
    );
    if (!job) {
      throw new BadRequestException('Job not found');
    }
    return job;
  }
}
