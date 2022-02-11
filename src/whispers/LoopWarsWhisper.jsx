import { React } from '@oliveai/ldk';
import { Direction, JustifyContent } from '@oliveai/ldk/dist/whisper';

import SwapiClient from '../network/SwapiClient';

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const nope = ['Not quite', 'Try again', 'Nope', 'Nuh uh'];
const yup = ["That's right!", "Yup, that's right!", 'You did it!'];
const MAX_GUESSES = 3;

export default function LoopWarsWhisper() {
  const [people, setPeople] = React.useState([]);
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [guess, setGuess] = React.useState('');
  const [guessCount, setGuessCount] = React.useState(0);
  const [correct, setCorrect] = React.useState(false);

  React.useEffect(async () => {
    setPeople(await SwapiClient.getPeople());
  }, []);

  React.useEffect(() => {
    setSelectedPerson(randomChoice(people));
  }, [people]);

  const getId = (personUrl) => {
    const splitUrl = personUrl.split('/');
    splitUrl.pop();
    return splitUrl.pop();
  };

  const makeGuess = () => {
    if (!correct && guessCount < MAX_GUESSES) {
      setGuessCount(guessCount + 1);
      setCorrect(
        selectedPerson.name.toLowerCase().includes(guess.toLowerCase())
      );
    }
  };

  const nextCharacter = () => {
    setCorrect(false);
    setGuess('');
    setGuessCount(0);
    setSelectedPerson(randomChoice(people));
  };

  return (
    <oh-whisper label="Loop Wars" onClose={null}>
      {selectedPerson ? (
        <>
          <oh-markdown
            body={`![](https://starwars-visualguide.com/assets/img/characters/${getId(
              selectedPerson.url
            )}.jpg)`}
          />
          {guessCount > 0 && (
            <oh-message
              header={correct ? randomChoice(nope) : randomChoice(yup)}
              body={
                (correct || guessCount >= MAX_GUESSES) && selectedPerson.name
              }
            />
          )}
          <oh-box
            direction={Direction.Horizontal}
            justifyContent={JustifyContent.Center}
          >
            {new Array(MAX_GUESSES - guessCount).fill(0).map(() => (
              <oh-icon name="language" />
            ))}
          </oh-box>
          <oh-text-input value={guess} onChange={setGuess} />
          <oh-box
            direction={Direction.Horizontal}
            justifyContent={JustifyContent.SpaceBetween}
          >
            <oh-button label="Guess" onClick={makeGuess} />
            <oh-button label="Next Character" onClick={nextCharacter} />
          </oh-box>
        </>
      ) : (
        <oh-progress />
      )}
    </oh-whisper>
  );
}
