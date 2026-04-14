import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@property-copilot/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { PERMISSIONS } from '../../common/pbac/permissions.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ApplicationsService } from './applications.service.js';

@Controller('applications')
export class ApplicationsController {
  constructor(@Inject(ApplicationsService) private readonly applicationsService: ApplicationsService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.APPLICATION_READ)
  list(@CurrentUser() user: { id: string; organizationId: string; role?: Role | string }) {
    return this.applicationsService.list(user);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.APPLICATION_CREATE)
  create(@CurrentUser() user: { id: string; organizationId: string }, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user, dto);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.APPLICATION_READ)
  getById(
    @CurrentUser() user: { id: string; organizationId: string; role?: Role | string },
    @Param('id') id: string,
  ) {
    return this.applicationsService.getById(user, id);
  }

  @Patch(':id/status')
  @RequirePermissions(PERMISSIONS.APPLICATION_REVIEW)
  updateStatus(
    @CurrentUser() user: { id: string; organizationId: string; role?: Role | string },
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    if (user.role === Role.TENANT) {
      throw new ForbiddenException('Tenant cannot update application status');
    }

    return this.applicationsService.updateStatus(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.APPLICATION_DELETE)
  remove(@CurrentUser() user: { id: string; organizationId: string }, @Param('id') id: string) {
    return this.applicationsService.remove(user, id);
  }
}
