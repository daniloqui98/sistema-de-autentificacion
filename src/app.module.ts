import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ExampleController } from './example/example.controller.js';


const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [ // Configuración de variables de entorno
    // isGlobal: true hace que ConfigModule esté disponible en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con MySQL
    // useFactory permite inyectar ConfigService para leer variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [_dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ Solo en desarrollo
      }),
      inject: [ConfigService],
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'saberia',
    }),
    UserModule,
    AuthModule,
  ],
  
  controllers: [AppController, ExampleController],
  providers: [AppService],
})

export class AppModule {}
