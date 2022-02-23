import { whisper } from '@oliveai/ldk';

// Scoped so the whole file can read from this array
const options = ['Padme', 'Yoda', 'R2D2', 'Leia', `${new Error()}`];

/* You can add parameters to functions when declaring them, so that you call them elsewhere with
 * arguments.
 * This is a type of function called, a function arrow expression. And is a more recent update that's commonly used these days
 *
 * This function Holds the image/dvideo url links to be used by the Select Component
 * Is there another way to rewrite this functionality in the code?
 */
const pictureChoice = (character) => {
  // The following string is part of the Mardown syntax: https://www.markdownguide.org/basic-syntax/
  // The above link shows examples for what the syntax translates to when rendered
  const pictureAndVideo = {
    Leia: `[![Leia](https://grazia.wwmindia.com/content/2020/may/hairleiabunsthumbnail1588581574.jpg)](https://www.youtube.com/watch?v=Q9taSDr4MwA)`,
    Yoda: `[![Yoda](https://static0.srcdn.com/wordpress/wp-content/uploads/2022/01/Yoda-Traits-Saber.jpg?q=50&fit=crop&w=963&h=481&dpr=1.5)](https://www.youtube.com/watch?v=fxCR2bFWHxM)`,
    Padme: `[![Padme](https://upload.wikimedia.org/wikipedia/en/e/ee/Amidala.png)](https://www.youtube.com/watch?v=jfzji6cH5iM)`,
    R2D2: `[![R2D2](https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/07/1487160686-r2-d2.jpg?crop=1.00xw:0.816xh;0,0.0372xh&resize=1200:*)](https://www.youtube.com/watch?v=JLmOteqmDYc)`,
  };

  // Property Access using bracket notation
  // What does this return?
  return pictureAndVideo[character];
};

// We stay consistent with using the same naming conventions, often times this is important as your codebase starts
// getting bigger
const createComponents = () => {
  const text = {
    type: whisper.WhisperComponentType.Message,
    style: whisper.Color.Black,
    body: 'Iconic Moments',
  };

  /**
   * This object contains a property (onSelect) with an anonymous function
   *
   * It adds the different characters and image/vids to the Select component. When selected
   * it creates a Markdown component that appears in OH.
   */
  const selectCharacter = {
    type: whisper.WhisperComponentType.Select,
    label: 'Click for more details',
    options,
    onSelect: (_error, val) => {
      // variable scoped to only this function
      const pic = pictureChoice(options[val]);
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

// Same as before one default function being exported to help with readability
export default function gallery() {
  return whisper.create({
    label: 'Gallery',
    components: createComponents(),
    onClose: () => {},
  });
}
