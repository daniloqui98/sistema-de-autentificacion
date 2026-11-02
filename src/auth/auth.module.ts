import { Module } from '@nestjs/common';
import {
  JwtModule,
  JwtModuleOptions,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    UserModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>(
          'JWT_SECRET',
        ),
        signOptions: {
          expiresIn: Number(
            configService.getOrThrow<string>(
              'JWT_EXPIRATION',
            ),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
