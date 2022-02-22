// right clicking on the imports and clicking Go to Definition will show you where they are being exported from
// For the imports coming from '@oliveai/ldk' (which is a package we added at the start with 'npm i') it will take you to
// a separate directory than the example whispers
import { ui, React, ReactWhisper } from '@oliveai/ldk';
import LoopWarsWhisper from './whispers/LoopWarsWhisper';
import helloWorld from './examples/example1';
import gallery from './examples/example2';
import DoggoAPI from './examples/example3';
import randomPersonAPI from './examples/example4';
import LoopWarsGame from './examples/example5';

/**
 * Is called by the loopOpenHandler Below, it calls the functions for each loop in order
 */
const start = async () => {
  helloWorld();
  gallery();
  DoggoAPI();
  randomPersonAPI();
  LoopWarsGame();
  // ReactWhisper.renderNewWhisper(<LoopWarsWhisper />);
};

// Method to open loops, this is a IIFE that runs as soon as its read
(() => ui.loopOpenHandler(start))();
