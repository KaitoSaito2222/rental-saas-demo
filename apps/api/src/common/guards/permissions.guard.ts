import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@property-copilot/shared';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { rolePolicyMap } from '../pbac/policy-map.js';
import type { Permission } from '../pbac/permissions.js';

type AuthenticatedUser = {
  role?: Role | string;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const role = request.user?.role;

    // Let JwtAuthGuard handle auth failures if guard ordering changes.
    if (!role) {
      return true;
    }

    if (!Object.values(Role).includes(role as Role)) {
      throw new ForbiddenException('Access denied');
    }

    const allowedPermissions = rolePolicyMap[role as Role] ?? [];
    const hasPermission = requiredPermissions.every((permission) =>
      allowedPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}