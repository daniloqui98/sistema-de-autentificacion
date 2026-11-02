import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { User } from '../../user/entities/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: string[] | undefined =
      this.reflector.getAllAndOverride<string[] | undefined>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // Si no se especificaron roles, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: User }>();

    // No hay usuario autenticado
    if (!user) {
      throw new UnauthorizedException('Debes iniciar sesión');
    }

    // El usuario no tiene el rol requerido
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'No tienes permisos para este recurso',
      );
    }

    return true;
  }
}