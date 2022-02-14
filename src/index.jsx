import { ui, React, ReactWhisper } from '@oliveai/ldk';
import LoopWarsWhisper from './whispers/LoopWarsWhisper';
import helloWorld from './examples/example1';
import gallery from './examples/example2';
import DoggoAPI from './examples/example3';
import randomPersonAPI from './examples/example4';
import LoopWarsGame from './examples/example5';

const start = async () => {
  helloWorld();
  // gallery();
  // DoggoAPI();
  // randomPersonAPI();
  // LoopWarsGame();
  // ReactWhisper.renderNewWhisper(<LoopWarsWhisper />);
};

(() => ui.loopOpenHandler(start))();
