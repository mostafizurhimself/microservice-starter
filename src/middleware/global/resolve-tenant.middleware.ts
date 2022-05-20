import logger from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { connect } from 'mongoose';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import Container, { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class ResolveTenant implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    // Skip database connection on test environment
    if (process.env.NODE_ENV == 'test') {
      return next();
    }

    // MongoDB connection url
    const dsn = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    // Connect Database
    try {
      // Connect to MongoDB. Example DSN: mongodb://username:password@localhost:27017/my_collection
      await connect(dsn);
      // logger.info("Database connected successfully");
    } catch (error) {
      console.log(error);
      logger.error('Could not connect to db');
      process.exit(1);
    }

    next();
  }
}
