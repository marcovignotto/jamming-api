import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// env variables (development, production, testing)
const ENV = process.env.NODE_ENV;

@Injectable()
export class AppService {
  constructor(@InjectConnection() private connection: Connection) {
    this.connection.on('connected', () => {
      // log development db
      if (ENV === 'development') {
        console.log(
          `MongoDb Connected to the development DB ${process.env.MONGODB_URI}`,
        );
      } else {
        // log production db
        console.log('MongoDb Connected');
      }
    });
    this.connection.on('disconnected', () => {
      console.log('MongoDb Disconnected');
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
