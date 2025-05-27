import { IsOptional, IsString } from 'class-validator';

export class FilterPermissionDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  items_per_page?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  method?: string;
}
