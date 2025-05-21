import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: 'Company id is required' })
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty({ message: 'Company name is required' })
  name: string;
}

export class UpdateUserDto {
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(0, { message: 'Age must be a positive number' })
  age?: number;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\d{10}$/, { message: 'Phone must contain exactly 10 digits' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  gender?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company?: Company;

  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  role?: string;
}
