import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditAction, Prisma, ResourceType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TenantContextService } from '../../prisma/tenant-context.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
  ) {}

  async register(dto: RegisterDto) {
    const existingOrganization = await this.prisma.organization.findUnique({
      where: { slug: dto.organizationSlug },
    });

    if (existingOrganization) {
      throw new BadRequestException('Organization slug already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const organization = await this.prisma.organization.create({
      data: {
        name: dto.organizationName,
        slug: dto.organizationSlug,
        country: dto.country,
        timezone: dto.timezone,
      },
    });

    const user = await this.tenantContext.run(organization.id, async () => {
      return this.prisma.user.create({
        data: {
          organizationId: organization.id,
          email: dto.email,
          passwordHash,
          role: dto.role,
        },
      });
    });

    const tokens = await this.tenantContext.run(organization.id, async () => {
      const sessionTokens = await this.issueTokens(user.id, user.organizationId, user.email, user.role);

      await this.prisma.auditLog.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          action: AuditAction.REGISTER,
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organization.id,
        },
      });

      return sessionTokens;
    });

    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug: dto.organizationSlug },
    });

    if (!organization) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.tenantContext.run(organization.id, async () => {
      return this.prisma.user.findFirst({
        where: {
          organizationId: organization.id,
          email: dto.email,
        },
      });
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tenantContext.run(organization.id, async () => {
      const sessionTokens = await this.issueTokens(user.id, user.organizationId, user.email, user.role);

      await this.prisma.auditLog.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          action: AuditAction.LOGIN,
          resourceType: ResourceType.USER,
          resourceId: user.id,
        },
      });

      return sessionTokens;
    });

    return { user, ...tokens };
  }

  async me(userId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId },
      include: { organization: true },
    });
  }

  private async issueTokens(userId: string, organizationId: string, email: string, role: Role) {
    return this.tenantContext.run(organizationId, async () => {
      const sessionId = randomUUID();
      const payload = { sub: userId, organizationId, email, role, sessionId };
      const accessToken = await this.jwtService.signAsync(payload);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await this.prisma.session.create({
        data: {
          id: sessionId,
          organizationId,
          userId,
          token: accessToken,
          expiresAt,
        },
      });

      return { accessToken, expiresAt };
    });
  }
}
