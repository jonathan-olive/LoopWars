import { network, whisper } from '@oliveai/ldk';
// https://swapi.dev/ = BASE_URL
const URL = 'https://swapi.dev/api/';
const MAX_PERSON = 83;
const MIN_PERSON = 1;

// We could also use this to reset the people array
const getPerson = async (num) => {
  let parsedBody;
  try {
    const request = {
      url: `${URL}/people/${num}`,
      headers: { 'Content-Type': ['application/json'] },
      method: 'GET',
    };
    const response = await network.httpRequest(request);
    const decodedBody = await network.decode(response.body);
    parsedBody = JSON.parse(decodedBody);
  } catch (err) {
    console.error(err);
  }

  return parsedBody;
};

const getRandomNumber = () =>
  Math.floor(Math.random() * (MAX_PERSON - MIN_PERSON) + MIN_PERSON);

const createComponents = async (person) => {
  const button = {
    type: whisper.WhisperComponentType.Button,
    label: 'Get Random Person',
    onClick: async (_, thisWhisper) => {
      const newPerson = await getPerson(getRandomNumber());
      thisWhisper.update({ components: await createComponents(newPerson) });
    },
  };

  const message = {
    type: whisper.WhisperComponentType.Message,
    body: person ? JSON.stringify(person) : 'None',
  };

  return [button, message];
};

export default async function randomPersonAPI() {
  const person = await getPerson(getRandomNumber());
  return whisper.create({
    label: 'Whisper',
    components: await createComponents(person),
    onClose: () => {},
  });
}
