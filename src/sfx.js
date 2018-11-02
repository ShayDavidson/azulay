// assets
export const TILES = [require("./assets/tile0.wav"), require("./assets/tile1.wav"), require("./assets/tile2.wav")];

// functions
export function playRandom(sfxArray) {
  let index = Math.floor(Math.random() * sfxArray.length);
  new Audio(sfxArray[index]).play();
}
