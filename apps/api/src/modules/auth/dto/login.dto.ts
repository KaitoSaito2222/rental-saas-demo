import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  organizationSlug!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
