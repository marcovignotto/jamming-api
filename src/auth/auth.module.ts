import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { MongooseModule } from '@nestjs/mongoose';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UserSchema } from '../schemas/user.schema';
import * as dotenv from 'dotenv';

// TODO
// change entries to schema
dotenv.config();

const ENV = process.env.NODE_ENV;

console.log('process.env.PORT', process.env.PORT);

@Module({
  imports: [
    // the schema will be available in service
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   isGlobal: true,
    //   // load: [configEnvVars],
    // }),
    //TODO
    // PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d' },
    }),
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
