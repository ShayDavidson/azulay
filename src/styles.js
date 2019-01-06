// @flow

import { css } from "glamor";
import Color from "color";

function placementColor(color: string): string {
  return Color(color)
    .desaturate(0.5)
    .toString();
}

/***********************************************************/

export const WHITE_COLOR = "hsl(30, 20%, 95%)";
export const BOARD_COLOR = "rgb(211, 182, 152)";
export const BLACK_COLOR = "hsl(360, 18%, 11%)";
export const BLUE_COLOR = "#2d7dbc";
export const TILE_COLORS = [BLUE_COLOR, "#f8c548", "#ee3231", BLACK_COLOR, "#71cbd4"];
export const PLACEMENT_COLORS = [
  placementColor(BLUE_COLOR),
  placementColor("#f8c548"),
  placementColor("#ee3231"),
  "#303030",
  placementColor("#71cbd4")
];
export const LABEL_COLORS = [BLACK_COLOR, BLACK_COLOR, BLACK_COLOR, WHITE_COLOR, BLACK_COLOR];
export const BOARD_TILE_SIZE = 44;
export const PLACEMENT_GAP = 0.08;
export const BOARD_BORDER_WIDTH = "3px";
export const BOARD_BORDER_COLOR = "rgba(100, 100, 100, 0.8)";
export const BOARD_PADDING = 0.1;
export const GLOBAL_PADDING = 10;

/***********************************************************/

const LIGHT_BORDER_ALPHA = 0.45;
const DARK_BORDER_ALPHA = 0.35;
export const HIGHLIGHT_WIDTH = "0.035em";
export const $bevelStyle = css({
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
});

/***********************************************************/

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
    backgroundColor: "hsl(31, 10%, 71%)",
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
