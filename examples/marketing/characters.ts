/**
 * The character artwork the hero places, addressed by URL rather than imported.
 *
 * The files live in the repository's own `public/`, which this app's Vite
 * config names as its `publicDir` — see the note there. The licensing terms are
 * in `src/patterns/characters.ts` and apply here unchanged: fan-distributed
 * renders, personal portfolio use only, replace before anything is sold.
 */
export const CHARACTERS = {
  yoyo: { src: './characters/killua-1.png', width: 988, height: 1263 },
  splatter: { src: './characters/killua-2.png', width: 970, height: 1323 },
};
