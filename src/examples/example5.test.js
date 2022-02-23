import { whisper } from '@oliveai/ldk';
import SwapiClient from '../network/SwapiClient';
import LoopWarsGame, { createComponents } from './example5';

jest.mock('@oliveai/ldk');
jest.mock('../network/SwapiClient');

const MOCK_PERSON = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: [
    'https://swapi.dev/api/films/2/',
    'https://swapi.dev/api/films/6/',
    'https://swapi.dev/api/films/3/',
    'https://swapi.dev/api/films/1/',
    'https://swapi.dev/api/films/7/',
  ],
  species: ['https://swapi.dev/api/species/1/'],
  vehicles: [
    'https://swapi.dev/api/vehicles/14/',
    'https://swapi.dev/api/vehicles/30/',
  ],
  starships: [
    'https://swapi.dev/api/starships/12/',
    'https://swapi.dev/api/starships/22/',
  ],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/ ',
};

describe('Creating Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SwapiClient.getPeople = jest.fn().mockResolvedValueOnce([MOCK_PERSON]);
  });

  it('returns the correct components when createComponents is called', async () => {
    let props = {
      people: SwapiClient.getPeople,
      selectedPerson: MOCK_PERSON,
      guessCount: 0,
      correct: false,
      header: '',
    };
    const actual = await createComponents(props);

    const expected = [
      expect.objectContaining({
        type: whisper.WhisperComponentType.Message,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Markdown,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Message,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Box,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Message,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Box,
      }),
    ];

    expect(actual).toEqual(expected);
  });

  it('shows the answer after max guesses (3) reached', async () => {
    let props = {
      people: SwapiClient.getPeople,
      selectedPerson: MOCK_PERSON,
      guessCount: 3,
      correct: false,
      header: '',
    };
    const person = await createComponents(props);
    const actual = person[2].body;
    const expected = `The answer was ${props.selectedPerson.name}`;
    expect(actual).toEqual(expected);
  });

  it('makes an API call to SWAPI successfully', async () => {
    await LoopWarsGame();

    expect(SwapiClient.getPeople).toBeCalled();
  });
});
