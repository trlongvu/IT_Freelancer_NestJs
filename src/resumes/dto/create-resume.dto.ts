import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Url is required' })
  url: string;

  @IsNotEmpty({ message: 'Status is required' })
  status: string;

  @IsNotEmpty({ message: 'Company is required' })
  @IsMongoId({ message: 'Invalid company ID format' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job is required' })
  @IsMongoId({ message: 'Invalid job ID format' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url is required' })
  url: string;

  @IsNotEmpty({ message: 'Company is required' })
  @IsMongoId({ message: 'Invalid company ID format' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job is required' })
  @IsMongoId({ message: 'Invalid job ID format' })
  jobId: mongoose.Schema.Types.ObjectId;
}
