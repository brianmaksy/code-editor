import path from 'path';
import { Command } from 'commander';
import { serve } from '@morphe/local-api';

// define process.env.NODE_ENV and override any local settings by individual users. 
const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      // serve returns promise 
      await serve(parseInt(options.port), path.basename(filename), dir, !isProduction);
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      )
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.error('Port is in use. Trying running on a different port.')
      } else {
        console.log('Here\'s the problem:', err.message);
      }
      // force exit of programme 
      process.exit(1);
    }

    // second arg: just the filename. 
  });