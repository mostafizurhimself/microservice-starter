import path from 'path';
import { getMetadataArgsStorage, useContainer, useExpressServer } from 'routing-controllers';
import 'reflect-metadata';

import express from 'express';
import Container from 'typedi';

const app = express();
useContainer(Container);
useExpressServer(app, {
  controllers: [path.join(__dirname, '../controllers/**/*.controller.*')],
  defaultErrorHandler: false,
  middlewares: [path.join(__dirname, '../middleware/global/*.middleware.*')],
});

const metadata = getMetadataArgsStorage();

console.table(metadata.actions);
