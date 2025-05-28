import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeAll(async () => {
  try {
    console.log(join(__dirname, '..', 'test.sqlite'));
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});
