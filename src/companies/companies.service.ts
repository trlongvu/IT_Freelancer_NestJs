import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import mongoose, { Model, UpdateResult } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { FilterCompanyDto } from './dto/filter-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
  ) {}
  async create(
    createCompanyDto: CreateCompanyDto,
    user: IUser,
  ): Promise<Company> {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: FilterCompanyDto) {
    const { search, address } = query;

    const current_page = Number(query.page) || 1;
    const items_per_page = Number(query.items_per_page) || 10;
    const offset = (current_page - 1) * items_per_page;

    const filter: { isDeleted: boolean; $or: any[]; address: any } = {
      isDeleted: false,
      $or: [],
      address: {},
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (address) {
      filter.address = { $regex: address, $options: 'i' };
    }

    const total_items = await this.companyModel.countDocuments(filter);
    const total_pages = Math.ceil(total_items / items_per_page);

    const result = await this.companyModel
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
      throw new NotFoundException('Invalid id');
    }
    const company = await this.companyModel.findById(_id);
    if (!company || company.isDeleted) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(
    _id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: IUser,
  ): Promise<UpdateResult> {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Invalid id');
    }
    const comany = await this.companyModel.updateOne(
      { _id, isDeleted: false },
      {
        $set: {
          ...updateCompanyDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );
    if (!comany.modifiedCount) {
      throw new NotFoundException('Company not found');
    }
    return comany;
  }

  async remove(_id: string, user: IUser): Promise<UpdateResult> {
    const comany = await this.companyModel.updateOne(
      {
        _id,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );
    if (!comany.modifiedCount) {
      throw new NotFoundException('Company not found');
    }
    return comany;
  }
}
