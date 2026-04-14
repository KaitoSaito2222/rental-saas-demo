import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Province } from '@rental-demo/shared';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(Province)
  province?: Province;
}
