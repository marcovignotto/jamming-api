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

// env variables (development, production, testing)

const getEnv = async () => {
  return await process.env.NODE_ENV;
};

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
      load: [configEnvVars],
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    // ! Clean
    // MongooseModule.forRoot('mongodb://localhost/jamming'),
    MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: async () => ({
        // uri: configService.get<string>('MONGODB_URI'),
        uri: process.env.MONGODB_URI,
        // uri: 'mongodb://localhost/jamming',
      }),
      // inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    JamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
