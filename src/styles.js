// @flow

import { css } from "glamor";
import Color from "color";

function placementColor(color: string): string {
  return Color(color)
    .desaturate(0.65)
    .toString();
}

/***********************************************************/

export const WHITE_COLOR = "hsl(30, 20%, 95%)";
export const BOARD_COLOR = "rgb(211, 182, 152)";
export const RED_COLOR = "#D91828";
export const YELLOW_COLOR = "#FFDC2C";
export const BLACK_COLOR = "hsl(360, 5%, 0%)";
export const BLUE_COLOR = "#0480C5";
export const TEAL_COLOR = "#0BC3D9";
export const TILE_COLORS = [BLUE_COLOR, YELLOW_COLOR, RED_COLOR, BLACK_COLOR, TEAL_COLOR];
export const PLACEMENT_COLORS = [
  placementColor(BLUE_COLOR),
  placementColor(YELLOW_COLOR),
  placementColor(RED_COLOR),
  placementColor("rgba(50, 50, 50, 1)"),
  placementColor("#00FFFA")
];
export const LABEL_COLORS = [BLACK_COLOR, BLACK_COLOR, BLACK_COLOR, WHITE_COLOR, BLACK_COLOR];
export const BOARD_TILE_SIZE = 44;
export const PLACEMENT_GAP = 0.08;
export const BOARD_BORDER_WIDTH = "3px";
export const BOARD_BORDER_COLOR = "rgba(50, 50, 50, 0.8)";
export const BOARD_PADDING = 0.1;
export const GLOBAL_PADDING = 10;

/***********************************************************/

const LIGHT_BORDER_ALPHA = 0.45;
const DARK_BORDER_ALPHA = 0.35;
export const HIGHLIGHT_WIDTH = "0.025em";
export const $bevelStyle = css({
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
});

/***********************************************************/

export const fadeInAnimation = css.keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 }
});

export const placeAnimation = css.keyframes({
  "0%": { transform: "scale(2.0) rotate(10deg)" },
  "90%": { transform: "scale(0.95)" },
  "100%": { transform: "scale(1)", zIndex: 0 }
});

export const popAnimation = css.keyframes({
  "0%": { transform: "scale(1.0)" },
  "50%": { transform: "scale(1.75)" },
  "100%": { transform: "scale(1.0)" }
});

export const subtlePopAnimation = css.keyframes({
  "0%": { transform: "scale(1.0)" },
  "50%": { transform: "scale(1.03)" },
  "100%": { transform: "scale(1.0)" }
});

export const floatAnimation = css.keyframes({
  "0%": { transform: "translateY(-1em)", opacity: 1 },
  "50%": { transform: "translateY(-1.5em)", opacity: 1 },
  "100%": { transform: "translateY(-2em)", opacity: 0 }
});

/***********************************************************/

export const ornaments = [
  undefined,
  require("./assets/ornament_yellow.png"),
  undefined,
  require("./assets/ornament_black.png"),
  require("./assets/ornament_teal.png")
];

export const firstOrnament = require("./assets/ornament_first.png");

/***********************************************************/

export function applyGlobalStyles() {
  addResetStyles();
}

function addResetStyles() {
  css.global("html, body", {
    margin: 0,
    width: "100%",
    height: "100%"
  });

  css.global("body", {
    userSelect: "none",
    backgroundColor: "hsl(31, 10%, 60%)",
    padding: GLOBAL_PADDING,
    fontFamily: "Helvetica",
    fontSize: BOARD_TILE_SIZE,
    color: BLACK_COLOR,
    overflow: "hidden"
  });

  css.global("*", {
    boxSizing: "border-box"
  });
}

/***********************************************************/

export function pick(classes: { [string]: boolean }): string {
  const enabledClasses = Object.keys(classes).filter(className => classes[className]);
  return css(...enabledClasses);
}
