import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Address is required' })
  @MinLength(2, { message: 'Address must be at least 2 characters long' })
  address: string;

  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  description: string;
}
