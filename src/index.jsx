import { ui, React, ReactWhisper } from '@oliveai/ldk';
import LoopWarsWhisper from './whispers/LoopWarsWhisper';

const start = async () => {
  ReactWhisper.renderNewWhisper(<LoopWarsWhisper />);
};

(() => ui.loopOpenHandler(start))();
