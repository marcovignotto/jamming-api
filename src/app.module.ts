import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configEnvVars from '../config/configuration';

// imports
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JamsModule } from './jams/jams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configEnvVars],
    }),
    AuthModule,
    UsersModule,
    JamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
