import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { TenantContextService } from '../../../prisma/tenant-context.service.js';

type JwtPayload = {
  sub: string;
  organizationId: string;
  email: string;
  role: string;
  sessionId: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'replace-me',
    });
  }

  async validate(payload: JwtPayload) {
    return this.tenantContext.run(payload.organizationId, async () => {
      const session = await this.prisma.session.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session || session.token === '' || session.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedException('Session expired');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          organizationId: payload.organizationId,
          email: payload.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid session');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      };
    });
  }
}
