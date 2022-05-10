import dotenv from 'dotenv';

if (process.env.NODE_ENV == 'test') {
  dotenv.config({ path: '.env.testing' });
} else {
  dotenv.config();
}
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morganLogger from './middleware/morgan.middleware';
import path from 'path';
import Container from 'typedi';
import AppServiceProvider from './providers/app-service.provider';
import helmet from 'helmet';
import logger from './utils/logger';
import { UploadedFile } from 'express-fileupload';
import { appPath } from './utils/helper';
import fs from 'fs';

const providers = [AppServiceProvider];
providers.forEach((provider) => new provider().register());

// Create an express app.
const app = express();

app.use(helmet());

//Serves resources from public folder
app.use('/public', express.static(`${appPath()}/public`)); // http://test.mydokan.io/public/uploads/image.jpg

// Global Middlewares
app.use(
  // Add custom helpers to request object
  (req, res, next) => {
    req.wantsJson = () => {
      return req.accepts()[0].includes('/json') || req.accepts()[0].includes('+json');
    };
    res.cleanTmp = () => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res;
      }

      const files: any = req.files;

      for (const file in files) {
        if (typeof files[file] === 'object' && !Array.isArray(files[file])) {
          const uploadedFile: UploadedFile = files[file];
          if (fs.existsSync(uploadedFile.tempFilePath)) {
            fs.unlinkSync(uploadedFile.tempFilePath);
            logger.info(`Removed tmp file (${uploadedFile.name}): ${uploadedFile.tempFilePath}`);
          }
        }

        if (Array.isArray(files[file])) {
          files[file].forEach((uploadedFile: UploadedFile) => {
            if (fs.existsSync(uploadedFile.tempFilePath)) {
              fs.unlinkSync(uploadedFile.tempFilePath);
              logger.info(`Removed tmp file (${uploadedFile.name}): ${uploadedFile.tempFilePath}`);
            }
          });
        }
      }
      return res;
    };
    next();
  }
);

// Parse the application/json request body.
app.use(express.json());

// Parse the x-www-form-urlencoded request body.
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
// Log the incoming requests.
app.use(morganLogger);

// Example route.
app.get('/', (req, res) => {
  return res.json({ message: 'Home, Sweet Home.' });
});

useContainer(Container);

useExpressServer(app, {
  routePrefix: '/api/v1',
  controllers: [path.join(__dirname + '/controllers/api/v1/**/*.controller.*')],
  defaultErrorHandler: false,
  middlewares: [path.join(__dirname, '/middleware/global/*.middleware.*')],
});

// Catch any error and send it as a json.
app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
  if (error) {
    logger.inspect(error);
    return res.status(500).json({ error: process.env.APP_DEBUG ? error.message : 'Server Error' });
  }
  return next();
});

// Catch 404.
app.use(function (req: Request, res: Response) {
  if (!res.headersSent) {
    return res.status(404).json({ message: 'Page Not Found!' });
  }
});

export default app;
