import { whisper } from '@oliveai/ldk';
import SwapiClient from '../network/SwapiClient';

// A list of possible responses a gamer would see if they responded incorrectly, feel free to add your own!
const nope = [
  'Not quite',
  'Try again',
  'Nope',
  'Nuh uh',
  'Much to learn, Padawan has',
];
// A list of possible responses a gamer would see if they responded correctly, feel free to add your own!
const yup = [
  "That's right!",
  "Yup, that's right!",
  'You did it!',
  'The Force is strong with you',
];
// This variable stores how many attempts a user has to guess, this can also be changed
const MAX_GUESSES = 3;

// This function takes an array and returns a random item from that array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// This function takes in the url string, turns it into an array and gets the Id from the end to
// use in the getting the picture.
const getId = (personUrl) => {
  const splitUrl = personUrl.split('/');
  splitUrl.pop();
  return splitUrl.pop();
};

/**
 * @param {Object} props - Object of variables that record state for each game session
 * @returns The components that will be added to the whisper
 *
 * What can we add to this function? Think about errors?
 */
export const createComponents = async (props) => {
  // We don't want to fetch the data every time, this is a logical OR (||) operator that uses the existing
  // data from SWAPI if it already exists. Otherwise it will fetch the data from the API
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

  const hintWord = selectedPerson.name
    .split('')
    .map((letter, index) => {
      if (letter === ' ') return ' ';
      if (index % 3 === 0) return letter;
      return '-';
    })
    .join('');
  const hint = {
    type: whisper.WhisperComponentType.Message,
    body: `Hint: ${hintWord}`,
  };

  const textInput = {
    type: whisper.WhisperComponentType.TextInput,
    label: '',
    value: guess,
    onChange: (_error, val) => {
      guess = val;
    },
  };

  /**
   * This is where the whisper is updated, based off the button click. If wrong it will remove a life
   * and ask you to try again. If correct, it will let you know. And it keeps track of your guess count.
   */
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
    hint,
    textInput,
    buttonBox,
  ];
};

export default async function LoopWarsGame() {
  return whisper.create({
    label: 'Loop Wars The Game',
    components: await createComponents({}),
  });
}
