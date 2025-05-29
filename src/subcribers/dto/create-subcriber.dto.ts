import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubcriberDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Skills are required' })
  @IsArray({ message: 'Skills must be an array' })
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills: string[];
}
