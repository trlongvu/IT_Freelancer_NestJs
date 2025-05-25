import { IsOptional, IsString } from 'class-validator';

export class FilterJobDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  items_per_page?: string;

  @IsOptional()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
