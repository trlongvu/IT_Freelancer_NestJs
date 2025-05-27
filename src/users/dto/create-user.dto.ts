import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  Length,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: 'Company id is required' })
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty({ message: 'Company name is required' })
  name: string;
}

export class CreateUserDto {
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Length(6, 50, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Age is required' })
  @Min(15, { message: 'Age must be at least 15 years old' })
  age: number;

  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\d{10}$/, { message: 'Phone must contain exactly 10 digits' })
  phone: string;

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsMongoId({ message: 'Role must be a valid MongoDB ObjectId' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Length(6, 50, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Age is required' })
  @Min(15, { message: 'Age must be at least 15 years old' })
  age: number;

  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\d{10}$/, { message: 'Phone must contain exactly 10 digits' })
  phone: string;

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
