import { whisper } from "@oliveai/ldk";
import { Color } from "@oliveai/ldk/dist/whisper";

// Scoped so the whole file can read from this array
const options = ["Padme", "Yoda", "R2D2", "Leia"];

// Arrow function more recent update, more commonly used these days
const createComponents = () => {
  const text = {
    type: whisper.WhisperComponentType.Message,
    style: Color.Black,
    body: "Iconic Moments",
  };

  const selectCharacter = {
    type: whisper.WhisperComponentType.Select,
    label: "Click for more details",
    options,
    onSelect: (_error, val) => {
      // variable scoped to only this function
      let pic = pictureChoice(options[val]);
      whisper.create({
        label: `${options[val]}`,
        components: [
          {
            type: whisper.WhisperComponentType.Markdown,
            body: pic,
          },
        ],
        onClose: () => {},
      });
    },
  };

  return [text, selectCharacter];
};

/* You can add parameters to functions, so you call them elsewhere with
 *arguments
 *
 *Is there another way to do this?
 */
const pictureChoice = (character) => {
  const pictureAndVideo = {
    Leia: `[![Leia](https://grazia.wwmindia.com/content/2020/may/hairleiabunsthumbnail1588581574.jpg)](https://www.youtube.com/watch?v=Q9taSDr4MwA)`,
    Yoda: `[![Yoda](https://static0.srcdn.com/wordpress/wp-content/uploads/2022/01/Yoda-Traits-Saber.jpg?q=50&fit=crop&w=963&h=481&dpr=1.5)](https://www.youtube.com/watch?v=fxCR2bFWHxM)`,
    Padme: `[![Padme](https://upload.wikimedia.org/wikipedia/en/e/ee/Amidala.png)](https://www.youtube.com/watch?v=jfzji6cH5iM)`,
    R2D2: `[![R2D2](https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/07/1487160686-r2-d2.jpg?crop=1.00xw:0.816xh;0,0.0372xh&resize=1200:*)](https://www.youtube.com/watch?v=JLmOteqmDYc)`,
  };

  return pictureAndVideo[character];
};

export default function gallery() {
  return whisper.create({
    label: "Gallery",
    components: createComponents(),
    onClose: () => {},
  });
}
