import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let cachedApp: any;

async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    cachedApp = app;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const instance = await bootstrapServer();
  return instance(req, res);
}
