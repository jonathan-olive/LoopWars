import { jest } from '@jest/globals';
import SwapiClient from '../network/SwapiClient';
import LoopWarsGame from './example5';

jest.mock('@oliveai/ldk');
jest.mock('../network/SwapiClient');

jest.describe('Creating Components', async () => {
  jest.beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.it(
    'returns the correct components when createComponents is called',
    () => {
      jest.LoopWarsGame({});

      jest.expect(SwapiClient).toBeCalled();
    }
  );
});
