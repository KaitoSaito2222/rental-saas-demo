import { Controller, Get, Inject } from '@nestjs/common';
import { Role } from '@property-copilot/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { PERMISSIONS } from '../../common/pbac/permissions.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @RequirePermissions(PERMISSIONS.DASHBOARD_READ)
  stats(@CurrentUser() user: { id: string; organizationId: string; role?: Role | string }) {
    return this.dashboardService.stats(user);
  }
}
