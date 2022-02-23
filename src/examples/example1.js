// If you right click and click on "Go To Definition" you can find the file this is being exported from
// In a javascript application, there are lots of programs that build off of other programs/packages/dependencies
// In our case we are using prebuilt objects and functions from a package called "@oliveai/ldk"
import { whisper } from '@oliveai/ldk';

/**
 * Functions are subprograms that can be called in other places throughout the code. They are objects,
 * with properties and methods, that perform a task or calculate a value.
 * They can take in arguments, and return a value. If no value is explicitly returned it defaults
 * to returning undefined.
 *
 * This is one style to write functions: named regular function
 * It returns an object!
 */
function createComponents() {
  /**
   * A declared const object stored in variable name 'text' (cannot be redeclared or updated)
   * All the building blocks to create a component are stored inside the object
   *
   * This will alow us to add a block of text to our whisper, the type of this component is Message
   * Take a look at the documentation to see different styles you can add to the Message Component
   */
  const text = {
    type: whisper.WhisperComponentType.Message,
    style: whisper.Color.Accent,
    body: 'Hello World!',
  };

  return text;
}

/**
 * Only allowed to have one default export in a file/module, however, you can have multiple exported objects or types
 *
 * When this function is imported and called in another file, it creates a whisper which will show up in Olive Helps.
 * The created function will have a label and any component pieces you added in the function above. You can even add something
 * to happen when the whisper closes.
 */
export default function helloWorld() {
  return whisper.create({
    label: 'Unleash The Force',
    components: [createComponents()],
    onClose: () => {},
  });
}
