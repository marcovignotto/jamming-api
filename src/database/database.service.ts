import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// env variables (development, production, testing)
const ENV = process.env.NODE_ENV;

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  // create connection
  connectMongoDB(): Connection {
    this.connection.on('connected', () => {
      // log development db
      if (ENV === 'development') {
        console.log(
          `MongoDb Connected to the development DB ${process.env.MONGODB_URI}`,
        );
      } else if (ENV === 'testing') {
        console.log(
          `MongoDb Connected to the test DB ${process.env.MONGODB_URI}`,
        );
      } else {
        // log production db
        console.log(`MongoDb Connected to ${process.env.MONGODB_URI}`);
      }
    });
    return this.connection.on('disconnected', () => {
      // log development db
      if (ENV === 'development') {
        console.log(
          `MongoDb Disconnected from development db: ${process.env.MONGODB_URI}`,
        );
      } else if (ENV === 'testing') {
        console.log(
          `MongoDb Disconnected from testing db: ${process.env.MONGODB_URI}`,
        );
      } else {
        // log production db
        console.log(`MongoDb Disconnected from: ${process.env.MONGODB_URI}`);
      }
    });
  }
}
