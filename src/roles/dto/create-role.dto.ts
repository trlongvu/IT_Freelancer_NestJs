import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Permissions are required' })
  @IsArray({ message: 'Permissions must be an array' })
  @IsMongoId({
    each: true,
    message: 'Each permission must be a valid MongoDB ObjectId',
  })
  permissions: mongoose.Schema.Types.ObjectId[];
}
