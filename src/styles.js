// @flow

import { css } from "glamor";

/***********************************************************/

export const WHITE_COLOR = "hsl(30, 20%, 90%)";
export const BLACK_COLOR = "#201718";
export const BLUE_COLOR = "#2d7dbc";
export const TILE_COLORS = [BLUE_COLOR, "#f8c548", "#ee3231", BLACK_COLOR, "#71cbd4"];
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
const HIGHLIGHT_WIDTH = "0.035em";
export const $bevelStyle = css({
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
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
    color: BLACK_COLOR
  });

  css.global("*", {
    boxSizing: "border-box"
  });
}
