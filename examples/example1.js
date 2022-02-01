import { whisper } from '@oliveai/ldk';
import { Color } from '@oliveai/ldk/dist/whisper';

// One style to write functions
function createComponents() {
  const text = {
    type: whisper.WhisperComponentType.Message,
    style: Color.Accent,
    body: 'Hello World!',
  };

  return text;
}

export default function () {
  return whisper.create({
    label: 'Unleash The Force',
    components: [createComponents()],
    onClose: () => {},
  });
}
