import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../user/user.service.js';
import { User } from '../../user/entities/user.entity.js';
import { JwtPayload } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(
        'JWT_SECRET',
      ),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user: User | null =
      await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuario inactivo',
      );
    }

    return user;
  }
}