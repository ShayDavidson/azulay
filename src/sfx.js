// assets
export const TILES = [
  require("./assets/tile0.wav"),
  require("./assets/tile1.wav"),
  require("./assets/tile2.wav"),
  require("./assets/tile3.wav"),
  require("./assets/tile4.wav"),
  require("./assets/tile5.wav"),
  require("./assets/tile6.wav"),
  require("./assets/tile7.wav"),
  require("./assets/tile8.wav")
];
export const SHUFFLE = require("./assets/shuffle.wav");
export const CLICK = require("./assets/click.mp3");

// functions
export function playRandom(sfxArray) {
  let index = Math.floor(Math.random() * sfxArray.length);
  play(sfxArray[index]);
}

export function play(sfx) {
  new Audio(sfx).play();
}
