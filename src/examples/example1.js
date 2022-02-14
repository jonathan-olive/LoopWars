import { whisper } from '@oliveai/ldk';

// One style to write functions
function createComponents() {
  const text = {
    type: whisper.WhisperComponentType.Message,
    style: whisper.Color.Accent,
    body: 'Hello World!',
  };

  return text;
}

/**
 * Only allowed to have one export default in a file/module
 */
export default function helloWorld() {
  return whisper.create({
    label: 'Unleash The Force',
    components: [createComponents()],
    onClose: () => {},
  });
}
