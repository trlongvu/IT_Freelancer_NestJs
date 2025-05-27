import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @MinLength(2, { message: 'Address must be at least 2 characters long' })
  address?: string;

  @IsOptional()
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Logo is required' })
  logo?: string;
}
