/* eslint-disable no-await-in-loop */
import { network } from '@oliveai/ldk';

const fetch = async (resource) => {
  const results = [];
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
    if (body.next === null) break;
  }
  return results;
};
export default {
  getPeople: async () => fetch('people'),
  getPlanets: async () => fetch('planets'),
  getSpecies: async () => fetch('species'),
};
