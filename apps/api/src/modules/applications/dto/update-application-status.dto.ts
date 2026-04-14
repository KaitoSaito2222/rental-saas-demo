import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '@rental-demo/shared';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}
