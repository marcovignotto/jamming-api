import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

// console.log('NODE ENV', process.env.PORT);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      // inject into factory method
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb://localhost/newTest',
        //           configService.get<string>('NODE_ENV') === 'development'
        //             ? configService.get<string>('MONGO_TEST_CONNECTION_URI')
        //             : configService.get<string>('MONGO_PROD_CONNECTION_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
