import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '@property-copilot/shared';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}
