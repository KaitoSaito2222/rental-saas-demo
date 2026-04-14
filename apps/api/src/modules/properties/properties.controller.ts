import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { PERMISSIONS } from '../../common/pbac/permissions.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { PropertiesService } from './properties.service.js';

@Controller('properties')
export class PropertiesController {
  constructor(@Inject(PropertiesService) private readonly propertiesService: PropertiesService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.PROPERTY_READ)
  list() {
    return this.propertiesService.list();
  }

  @Post()
  @RequirePermissions(PERMISSIONS.PROPERTY_WRITE)
  create(@CurrentUser() user: { id: string; organizationId: string }, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(user, dto);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.PROPERTY_READ)
  getById(@Param('id') id: string) {
    return this.propertiesService.getById(id);
  }

  @Get(':id/applications')
  @RequirePermissions(PERMISSIONS.APPLICATION_REVIEW)
  getApplications(@Param('id') id: string, @CurrentUser() user: { organizationId: string }) {
    return this.propertiesService.getApplications(user.organizationId, id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.PROPERTY_WRITE)
  update(
    @CurrentUser() user: { id: string; organizationId: string },
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.PROPERTY_DELETE)
  remove(@CurrentUser() user: { id: string; organizationId: string }, @Param('id') id: string) {
    return this.propertiesService.remove(user, id);
  }
}
