import { whisper, network } from "@oliveai/ldk";
import { Color } from "@oliveai/ldk/dist/whisper";

const URL = `https://dog.ceo/api/breed`;

const getDog = async (breed, subBreed, imageCount) => {
  const updatedURL = subBreed
    ? `${URL}/${breed}/${subBreed}/images/random/${imageCount}`
    : `${URL}/${breed}/images/random/${imageCount}`;
  try {
    const request = {
      url: updatedURL,
      method: "GET",
    };
    const response = await network.httpRequest(request);
    const decodedBody = await network.decode(response.body);
    const parsedBody = JSON.parse(decodedBody);
    return parsedBody;
  } catch (err) {
    console.error(err);
  }
};

let breed = "";
let breedValidation = "";
let subBreed = "";
let imageCount = 1;
let dogImage = {};

const inputComponents = () => {
  const breedInput = {
    type: whisper.WhisperComponentType.TextInput,
    validationError: breedValidation,
    label: "Breed Name",
    onChange: (_error, val) => {
      breed = val.toLowerCase();
    },
  };

  const subBreedInput = {
    type: whisper.WhisperComponentType.TextInput,
    label: "SubBreed Name (optional)",
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
    tooltip: "How many images? (optional)",
    label: "How many images? (optional)",
    onChange: (_error, val) => {
      imageCount = val;
    },
  };

  return [breedInput, subBreedInput, numberInput];
};

const createComponents = () => {
  const inputs = inputComponents();
  const images = [];
  if (Array.isArray(dogImage.message) && dogImage.message.length >= 1) {
    for (let i = 0; i < dogImage.message.length; i += 1) {
      images.push({
        type: whisper.WhisperComponentType.Markdown,
        body: `![doggo](${dogImage.message[i]})`,
      });
    }
  }

  const submit = {
    type: whisper.WhisperComponentType.Button,
    label: "Go Fetch",
    onClick: async (_, thisWhisper) => {
      dogImage = await getDog(breed, subBreed, imageCount);
      if (!breed) breedValidation = "This field is required";
      else breedValidation = "";

      if (dogImage.status === "success")
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

  return [...inputs, submit, ...images];
};

export default function translatorAPI() {
  return whisper.create({
    label: "Good Doggo",
    components: createComponents(),
    onClose: () => {},
  });
}
