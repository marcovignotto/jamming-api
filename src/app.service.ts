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
          `MongoDb Connected to the development DB ${process.env.MONGO_TEST_CONNECTION_URI}`,
        );
      } else {
        // log production db
        console.log(`MongoDb Connected to the production Database`);
      }
    });
    this.connection.on('disconnected', () => {
      // log development db
      if (ENV === 'development') {
        console.log(
          `MongoDb Disconnected from development db: ${process.env.MONGO_TEST_CONNECTION_URI}`,
        );
      } else {
        // log production db
        console.log(`MongoDb Disconnected from the production Database`);
      }
    });
  }

  getHello(): string {
    return 'Welcome to the *** jamming API ***. See how it works: <a href="http://localhost:5000/api-docs/">http://localhost:5000/api-docs/</a>';
  }
}
