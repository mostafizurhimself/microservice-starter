import logger from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { connect } from 'mongoose';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import Container, { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class ResolveTenant implements ExpressMiddlewareInterface {
  async use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    // Skip database connection on test environment
    if (process.env.NODE_ENV == 'test') {
      return next();
    }

    const tenant = request.get('tenant') || request.subdomains[0];

    if (!tenant) {
      throw new Error('Tenant could not be resolved.');
    }

    let dsn = '';
    if (process.env.DB_USER) {
      dsn = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${tenant}`;
    } else {
      dsn = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${tenant}`;
    }
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

    request.headers['tenant'] = tenant;
    Container.set('tenant', tenant);
    Container.set('request', request);

    next();
  }
}
