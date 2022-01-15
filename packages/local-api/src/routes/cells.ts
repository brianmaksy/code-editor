import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json()); // to allow access to req.body 

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // read the file 
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (err: any) {
      // error: no entity
      if (err.code === 'ENOENT') {
        // add code to create a file and add default cells
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // take the list of cells from the request obj
    // serialise them
    const { cells }: { cells: Cell[] } = req.body; // array of objects 

    // write the cells to the file in plaintext. 
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });
  return router;
}