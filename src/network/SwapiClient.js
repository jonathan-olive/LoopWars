/* eslint-disable no-await-in-loop */
import { network } from '@oliveai/ldk';

/**
 * A GET client that fetches data from SWAPI, to be used when needed!
 *
 * @param {string} resource - people, planets, species you can find the different resources in the SWAPI documentation
 * @returns returns an array of objects, that match the resource
 */
const fetch = async (resource) => {
  const results = [];
  // As long as a page exists, it will keep going and adding to the array of results
  // eslint-disable-next-line no-constant-condition
  for (let page = 1; true; page += 1) {
    const body = JSON.parse(
      await network.decode(
        (
          await network.httpRequest({
            method: 'GET',
            url: `https://swapi.dev/api/${resource}/?page=${page}`,
          })
        ).body
      )
    );
    results.push(...body.results);
    // break is a special keyword that stops the for loop and breaks out of it
    // once there aren't anymore pages coming up we want to escape so we don't get undefined error
    if (body.next === null) break;
  }
  return results;
};
// The async function keyword can be used to define async functions inside expressions. It will always return a Promise.
// These functions will be imported and awaited in the Loop Wars game.
export default {
  getPeople: async () => fetch('people'),
  getPlanets: async () => fetch('planets'),
  getSpecies: async () => fetch('species'),
};
