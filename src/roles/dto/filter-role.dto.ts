import { IsOptional, IsString } from 'class-validator';

export class FilterRoleDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  items_per_page?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
