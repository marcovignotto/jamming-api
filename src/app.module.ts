import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// imports

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JamsModule } from './jams/jams.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule, //DB connection
    AuthModule,
    UsersModule,
    JamsModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    AppService,
    // protect ALL the routes
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
