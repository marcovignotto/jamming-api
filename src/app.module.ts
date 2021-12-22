import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configEnvVars from '../config/configuration';

// imports
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JamsModule } from './jams/jams.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

// export const IS_PUBLIC_KEY = 'isPublic';
// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// env variables (development, production, testing)

const getEnv = async () => {
  return await process.env.NODE_ENV;
};

const ENV = process.env.NODE_ENV;

//TODO
// create a globconfig for the env

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
      load: [configEnvVars],
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    // TODO
    // ! Clean
    // MongooseModule.forRoot('mongodb://localhost/jamming'),
    MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: async () => ({
        // uri: configService.get<string>('MONGODB_URI'),
        uri: process.env.MONGODB_URI,
        // uri: 'mongodb://localhost/jamming',
        // uri: 'mongodb://root:pass12345@mongodb',
      }),
      // inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    JamsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // protect all the routes
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
