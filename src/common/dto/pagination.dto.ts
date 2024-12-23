import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10;
}
