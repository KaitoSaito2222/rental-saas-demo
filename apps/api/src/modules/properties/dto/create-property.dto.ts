import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Province } from '@property-copilot/shared';

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
