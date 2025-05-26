import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class UpdatedBy {
  @IsNotEmpty({ message: 'User id is required' })
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

class History {
  @IsNotEmpty({ message: 'Status is required' })
  status: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsNotEmpty({ message: 'Updated by is required' })
  @ValidateNested()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNotEmpty({ message: 'History is required' })
  @IsArray({ message: 'History is a array' })
  @ValidateNested()
  @Type(() => History)
  history: History[];
}
