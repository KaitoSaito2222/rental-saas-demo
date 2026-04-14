import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Province } from '@rental-demo/shared';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsEnum(Province)
  province!: Province;
}
