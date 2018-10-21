// @flow

import { css } from "glamor";

export function applyGlobalStyles() {
  addResetStyles();
}

export const TILE_COLORS = ["#2d7dbc", "#f8c548", "#ee3231", "#201718", "#71cbd4"];
export const BOARD_TILE_SIZE = 40;
export const PLACEMENT_GAP = 0.08;
export const BOARD_BORDER_WIDTH = "3px";
export const BOARD_BORDER_COLOR = "rgba(100, 100, 100, 0.8)";
export const BOARD_PADDING = 0.1;
export const GLOBAL_PADDING = 10;

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
    color: "rgba(20, 20, 20, 1)"
  });

  css.global("*", {
    boxSizing: "border-box"
  });
}
