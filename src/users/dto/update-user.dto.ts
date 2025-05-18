import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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
}
