import { IsOptional, IsString } from 'class-validator';

export class FilterSubcriberDto {
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
