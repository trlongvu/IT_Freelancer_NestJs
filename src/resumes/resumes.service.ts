import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { FilterResumeDto } from './dto/filter-resume.dto';
import { UsersService } from 'src/users/users.service';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: Model<ResumeDocument>,

    private userService: UsersService,
    private jobService: JobsService,
  ) {}
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    return await this.resumeModel.create({
      ...createResumeDto,
      history: [
        {
          status: createResumeDto.status,
          updatedAt: new Date(),
          updatedBy: { _id: user._id, email: user.email },
        },
      ],
      userId: user._id,
      createdBy: { _id: user._id, email: user.email },
    });
  }

  async getCvByUser(user: IUser) {
    return await this.resumeModel
      .find({ userId: user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('companyId', 'name')
      .populate('jobId', 'name')
      .exec();
  }

  async getCvByHr(query: FilterResumeDto, jobId: string, user: IUser) {
    const { search } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const userDetail = await this.userService.findOne(user._id);
    if (!userDetail.company?._id) {
      throw new NotFoundException('Company of HR is not found');
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    const job = await this.jobService.findOne(jobId);
    if (!job || job.company._id !== userDetail.company._id) {
      throw new BadRequestException('Job is not belong to this company');
    }

    const filter: {
      isDeleted: boolean;
      $or: any[];
      companyId: mongoose.Types.ObjectId;
      jobId: mongoose.Types.ObjectId;
    } = {
      isDeleted: false,
      $or: [],
      companyId: userDetail.company._id,
      jobId: new mongoose.Types.ObjectId(jobId),
    };

    if (search) {
      filter.$or = [{ email: { $regex: search, $options: 'i' } }];
    }

    const total_items = await this.resumeModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(items_per_page)
      .sort({ createdAt: -1 })
      .populate('userId', 'email name')
      .populate('companyId', 'name')
      .populate('jobId', 'title')
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

  async findAll(query: FilterResumeDto) {
    const { search, status } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: { isDeleted: boolean; $or: any[]; status?: any } = {
      isDeleted: false,
      $or: [],
    };

    if (search) {
      filter.$or = [{ email: { $regex: search, $options: 'i' } }];
    }

    if (status) {
      filter.status = status;
    }

    const total_items = await this.resumeModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(items_per_page)
      .sort({ createdAt: -1 })
      .populate('userId', 'email name')
      .populate('companyId', 'name')
      .populate('jobId', 'title')
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
      throw new BadRequestException('Invalid resume ID');
    }
    const resume = await this.resumeModel
      .findOne({ _id, isDeleted: false })
      .populate('userId', 'email name')
      .populate('companyId', 'name')
      .populate('jobId', 'title');
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid resume ID');
    }
    const resume = await this.resumeModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        status,
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: { _id: user._id, email: user.email },
          },
        },
        updatedBy: { _id: user._id, email: user.email },
      },
      {
        new: true,
      },
    );
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid resume ID');
    }
    const resume = await this.resumeModel.findOneAndUpdate(
      { _id, isDeleted: false },
      {
        isDeleted: true,
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }
}
