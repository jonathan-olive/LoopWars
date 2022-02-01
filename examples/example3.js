import { network, whisper, user } from '@oliveai/ldk';
// https://swapi.dev/
const URL = 'https://swapi.dev/api/';
const MAX_PERSON = 83;
const MIN_PERSON = 1;

// We could also use this to reset the poeple array
const getPerson = async (num) => {
  try {
    const request = {
      url: `${URL}/people/${num}`,
      headers: { 'Content-Type': ['application/json'] },
      method: 'GET',
    };
    const response = await network.httpRequest(request);
    const decodedBody = await network.decode(response.body);
    const parsedBody = JSON.parse(decodedBody);
    return parsedBody;
  } catch (err) {
    console.error(err);
  }
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * (MAX_PERSON - MIN_PERSON) + MIN_PERSON);
};

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

(async function main() {
  const person = await getPerson(getRandomNumber());
  whisper.create({
    label: 'Whisper',
    components: await createComponents(person),
    onClose: () => {},
  });
})();
