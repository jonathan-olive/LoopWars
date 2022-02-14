import { whisper } from '@oliveai/ldk';
import SwapiClient from '../network/SwapiClient';

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const nope = [
  'Not quite',
  'Try again',
  'Nope',
  'Nuh uh',
  'Much to learn, Padawan has',
];
const yup = [
  "That's right!",
  "Yup, that's right!",
  'You did it!',
  'The Force is strong with you',
];
const MAX_GUESSES = 3;

const getId = (personUrl) => {
  const splitUrl = personUrl.split('/');
  splitUrl.pop();
  return splitUrl.pop();
};

const createComponents = async (props) => {
  const people = props.people || (await SwapiClient.getPeople());
  const selectedPerson = props.selectedPerson || randomChoice(people);
  let guessCount = props.guessCount || 0;
  let guess = '';
  let correct = false;
  let header = props.header || '';
  let score = props.score || 0;

  const streakScore = {
    type: whisper.WhisperComponentType.Message,
    style: whisper.Color.Grey,
    textAlign: whisper.TextAlign.Right,
    body: `Streak: ${score}`,
  };

  const picture = {
    type: whisper.WhisperComponentType.Markdown,
    body: `![](https://starwars-visualguide.com/assets/img/characters/${getId(
      selectedPerson.url
    )}.jpg)`,
  };

  const guessAttempt = {
    type: whisper.WhisperComponentType.Message,
    header,
    textAlign: whisper.TextAlign.Center,
    body:
      guessCount >= MAX_GUESSES ? `The answer was ${selectedPerson.name}` : '',
  };

  const healthBarChild = {
    type: whisper.WhisperComponentType.Icon,
    name: 'language',
  };

  const healthBarBox = {
    type: whisper.WhisperComponentType.Box,
    children: new Array(MAX_GUESSES - guessCount)
      .fill(0)
      .map(() => healthBarChild),
    direction: whisper.Direction.Horizontal,
    justifyContent: whisper.JustifyContent.Center,
  };

  const textInput = {
    type: whisper.WhisperComponentType.TextInput,
    label: '',
    value: guess,
    onChange: (_error, val) => {
      guess = val;
    },
  };

  const guessButton = {
    type: whisper.WhisperComponentType.Button,
    label: 'Guess',
    onClick: async (_, thisWhisper) => {
      if (guess && !correct && guessCount < MAX_GUESSES) {
        guessCount += 1;
        const wasCorrect =
          selectedPerson.name.toLowerCase() === guess.toLowerCase();
        header = wasCorrect ? randomChoice(yup) : randomChoice(nope);
        score = wasCorrect ? score + 1 : score;
        correct = wasCorrect;
      }
      guess = '';
      thisWhisper.update({
        components: await createComponents({
          people,
          selectedPerson,
          guessCount,
          correct,
          header,
          score,
        }),
      });
    },
  };

  const nextCharButton = {
    type: whisper.WhisperComponentType.Button,
    label: 'Next Character',
    onClick: async (_, thisWhisper) => {
      thisWhisper.update({
        components: await createComponents({ people, score }),
      });
    },
  };

  const buttonBox = {
    type: whisper.WhisperComponentType.Box,
    children: [guessButton, nextCharButton],
    direction: whisper.Direction.Horizontal,
    justifyContent: whisper.JustifyContent.SpaceBetween,
  };

  return [
    streakScore,
    picture,
    guessAttempt,
    healthBarBox,
    textInput,
    buttonBox,
  ];
};

export default async function LoopWarsGame() {
  return whisper.create({
    label: 'Loop Wars The Game',
    components: await createComponents({}),
    onClose: () => {},
  });
}
