import { Controller, Get, Inject } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get('stats')
  stats(@CurrentUser() user: { organizationId: string }) {
    return this.dashboardService.stats(user.organizationId);
  }
}
