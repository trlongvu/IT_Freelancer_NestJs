import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Length(6, 50, { message: 'Password must be at least 6 characters long' })
  password: string;
}
