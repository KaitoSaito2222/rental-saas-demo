import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ApplicationsService } from './applications.service.js';

@Controller('applications')
export class ApplicationsController {
  constructor(@Inject(ApplicationsService) private readonly applicationsService: ApplicationsService) {}

  @Get()
  list(@CurrentUser() user: { organizationId: string }) {
    return this.applicationsService.list(user.organizationId);
  }

  @Post()
  create(@CurrentUser() user: { id: string; organizationId: string }, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user, dto);
  }

  @Get(':id')
  getById(@CurrentUser() user: { organizationId: string }, @Param('id') id: string) {
    return this.applicationsService.getById(user.organizationId, id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: { id: string; organizationId: string },
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(user, id, dto);
  }
}
