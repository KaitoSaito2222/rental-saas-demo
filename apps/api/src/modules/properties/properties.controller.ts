import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { PropertiesService } from './properties.service.js';

@Controller('properties')
export class PropertiesController {
  constructor(@Inject(PropertiesService) private readonly propertiesService: PropertiesService) {}

  @Get()
  list(@CurrentUser() user: { organizationId: string }) {
    return this.propertiesService.list(user.organizationId);
  }

  @Post()
  create(@CurrentUser() user: { id: string; organizationId: string }, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(user, dto);
  }

  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user: { organizationId: string }) {
    return this.propertiesService.getById(user.organizationId, id);
  }

  @Get(':id/applications')
  getApplications(@Param('id') id: string, @CurrentUser() user: { organizationId: string }) {
    return this.propertiesService.getApplications(user.organizationId, id);
  }
}
