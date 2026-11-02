import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Decorador para especificar roles requeridos
 * Uso: @Roles('admin', 'moderator')
 */
export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);