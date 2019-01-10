import { Howl } from "howler";

// assets
export const TILES = [
  wrap(require("./assets/tile0.wav")),
  wrap(require("./assets/tile1.wav")),
  wrap(require("./assets/tile2.wav")),
  wrap(require("./assets/tile3.wav")),
  wrap(require("./assets/tile4.wav")),
  wrap(require("./assets/tile5.wav")),
  wrap(require("./assets/tile6.wav")),
  wrap(require("./assets/tile7.wav")),
  wrap(require("./assets/tile8.wav"))
];
export const SCORE = [
  wrap(require("./assets/score0.mp3")),
  wrap(require("./assets/score1.mp3")),
  wrap(require("./assets/score2.mp3")),
  wrap(require("./assets/score3.mp3")),
  wrap(require("./assets/score4.mp3")),
  wrap(require("./assets/score5.mp3")),
  wrap(require("./assets/score6.mp3")),
  wrap(require("./assets/score7.mp3")),
  wrap(require("./assets/score8.mp3")),
  wrap(require("./assets/score9.mp3"))
];
export const SCORE_BAD = wrap(require("./assets/score_bad.wav"));
export const SHUFFLE = wrap(require("./assets/shuffle.wav"));
export const CLICK = wrap(require("./assets/click.mp3"));
export const END = wrap(require("./assets/end.mp3"));

// functions
function wrap(path) {
  return new Howl({
    src: [path],
    html5: true
  });
}

export function playRandom(sfxArray) {
  let index = Math.floor(Math.random() * sfxArray.length);
  play(sfxArray[index]);
}

export function play(sfx) {
  sfx.play();
}
