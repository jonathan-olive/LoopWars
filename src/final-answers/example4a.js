import { network, whisper } from '@oliveai/ldk';
// https://swapi.dev/ = BASE_URL
const URL = 'https://swapi.dev/api/';
// In order to avoid having numbers scattered around called "Magic Numbers", we give them a clear label and declare them
// at the top of the file
const MAX_PERSON = 83;
const MIN_PERSON = 1;

// We could also use this to reset the people array
// Here you see async...await again since we are making more network calls to the API
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

// Math is a built in object in Javascript, you don't need to import it. It comes with methods that let you
// perform mathematical functions
const getRandomNumber = () =>
  Math.floor(Math.random() * (MAX_PERSON - MIN_PERSON) + MIN_PERSON);

// Creates the components to be displayed
const createComponents = (person) => {
  // Since the onClick function is scoped to the property value, it will need its own async
  const button = {
    type: whisper.WhisperComponentType.Button,
    label: 'Get Random Person',
    onClick: async (_, thisWhisper) => {
      const newPerson = await getPerson(getRandomNumber());
      thisWhisper.update({ components: createComponents(newPerson) });
    },
  };

  const message = {
    type: whisper.WhisperComponentType.Message,
    body: person ? JSON.stringify(person) : 'None',
  };

  return [button, message];
};

export default async function randomPersonAPI() {
  // Remember you can pass any type of value in as an argument, in this case a funcction is called and getPerson receives
  // the returned value of that function and is also called
  const person = await getPerson(getRandomNumber());
  return whisper.create({
    label: 'Whisper',
    components: await createComponents(person),
    onClose: () => {},
  });
}
