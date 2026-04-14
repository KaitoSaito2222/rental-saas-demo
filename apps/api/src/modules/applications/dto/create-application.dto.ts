import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  propertyId!: string;

  @IsEmail()
  applicantEmail!: string;

  @IsInt()
  @Min(0)
  income!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
