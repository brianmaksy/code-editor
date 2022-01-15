import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (port: number, filename: string, dir: string, useProxy: boolean) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    app.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
      logLevel: 'silent',
    }));
  } else {
    // absolute path in my os. Require.resolve is a NodeJS function. 
    const packagePath = require.resolve('@morphe/local-client/build/index.html');
    // reaching out to the directory "build", which contains both index.html and index.js 
    // i.e. our code-editor app. 
    app.use(express.static(path.dirname(packagePath)));
  }


  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};