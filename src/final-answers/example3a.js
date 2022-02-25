import { whisper, network } from '@oliveai/ldk';
import { Color } from '@oliveai/ldk/dist/whisper';

// BASE URL - contains schema, host, and basePath it is the url to which all the api
// endpoints are appended
const URL = `https://dog.ceo/api/breed`;
let breed = '';
let breedValidation = '';
let subBreed = '';
let imageCount = 1;
let dogImage = {};

/**
 * This function calls the API and gets the image url of the dog. You might have noticed the keywords
 * async...await. These are used whenever process requires time to complete, the program being run will wait
 * until the value is received at an await before moving on.
 *
 * @param {string} breed - takes in the breed of the dog
 * @param {string} subBreed - takes in the subBreed of the dog
 * @param {number} imageCount - takes in how many pictures you want displayed
 * @returns the parsed response body from API
 */
const getDog = async (breedName, subBreedName, pictureNumber) => {
  // Instead of writing if statements, we can use something called a conditional (ternary) operator (takes in 3 values)
  // a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:),
  // and finally the expression to execute if the condition is falsy.
  const updatedURL = subBreed
    ? `${URL}/${breedName}/${subBreedName}/images/random/${pictureNumber}`
    : `${URL}/${breedName}/images/random/${pictureNumber}`;
  let parsedBody;
  /**
   * The try...catch statement marks a block of statements to try, and specifies a response should an exception be thrown.
   */
  try {
    // Methods can include: GET, POST, PUT, DELETE
    const request = {
      url: updatedURL,
      method: 'GET',
    };
    // We use Olive's network aptitude to send a request for data
    // response would like {"statusCode": 200, "body": "0":123, "1",34....}
    const response = await network.httpRequest(request);
    // When that data is returned from the API, we want to decode it so it's understandable to humans
    // decodedBody would like "{\"message\":[\"https:\\/\\/images.dog.ceo\\/breeds\\/boxer\\/n02108089_2723.jpg\"],\"status\":\"success\"}"
    const decodedBody = await network.decode(response.body);
    // We parse the JSON string from decodedBody to a javascript object
    parsedBody = JSON.parse(decodedBody);
  } catch (err) {
    // If there were any errors in the try block, with API call or incorrect logic
    console.error(err);
  }

  return parsedBody;
};

/**
 * This function handles all the components where the user will be entering in values
 * @returns components with inputs
 */
const inputComponents = () => {
  // Some components have an 'onChange' property which calls a functions every time the value in the text box is updated
  // ValidationError - We require this input component to have a value inputted, look for the breedValidation variable in
  // the code to see how validationError is being triggered
  const breedInput = {
    type: whisper.WhisperComponentType.TextInput,
    validationError: breedValidation,
    label: 'Breed Name',
    onChange: (_error, val) => {
      breed = val.toLowerCase();
    },
  };

  const subBreedInput = {
    type: whisper.WhisperComponentType.TextInput,
    label: 'SubBreed Name (optional)',
    onChange: (_error, val) => {
      subBreed = val.toLowerCase();
    },
  };

  const numberInput = {
    type: whisper.WhisperComponentType.Number,
    value: 1,
    max: 4,
    min: 1,
    step: 1,
    tooltip: 'How many images? (optional)',
    label: 'How many images? (optional)',
    onChange: (_error, val) => {
      // Try to explain what is going on here?
      imageCount = val;
    },
  };

  return [breedInput, subBreedInput, numberInput];
};

/**
 * This function creates all the components in the loop, it calls the inputComponents above
 * @returns displayed components
 */
const createComponents = () => {
  const inputs = inputComponents();
  const images = [];
  // verify that getDog returns a body, where message property is an array. If this is
  // the first time starting the loop it should fail here and go straight to the submit button
  if (Array.isArray(dogImage.message) && dogImage.message.length >= 1) {
    for (let i = 0; i < dogImage.message.length; i += 1) {
      // We add the markdown components to an array element, we use markdown so we can access the image links
      images.push({
        type: whisper.WhisperComponentType.Markdown,
        body: `![doggo](${dogImage.message[i]})`,
      });
    }
  }

  // We put the logic of the different scenarios that can arise when button is clicked based on the values in the onClick handler
  const submit = {
    type: whisper.WhisperComponentType.Button,
    label: 'Go Fetch',
    onClick: async (_, thisWhisper) => {
      dogImage = await getDog(breed, subBreed, imageCount);
      // Is there another way to rewrite this?
      if (!breed) breedValidation = 'This field is required';
      else breedValidation = '';

      // You can leave off brackets in if statements when only one statement is being performed
      if (dogImage.status === 'success')
        thisWhisper.update({ components: createComponents() });
      else
        thisWhisper.update({
          components: [
            ...createComponents(),
            {
              type: whisper.WhisperComponentType.Message,
              style: Color.Accent,
              body: "Unable to find breed, please try again. (E.g. Breed: 'Boxer' or Breed: 'Australian', SubBreed 'Shepherd')",
            },
          ],
        });
    },
  };

  // The ... is called a spread, in our case inputs and images are arrays with items inside. The spread will allow us
  // to extract those elements and put them into a new array list [] that is being returned
  return [...inputs, submit, ...images];
};

export default function translatorAPI() {
  return whisper.create({
    label: 'Good Doggo',
    components: createComponents(),
    onClose: () => {},
  });
}
