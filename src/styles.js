// @flow

import { css } from "glamor";

export function applyGlobalStyles() {
  addResetStyles();
}

export const TILE_COLORS = ["#2d7dbc", "#f8c548", "#ee3231", "#201718", "#71cbd4"];
export const BOARD_TILE_SIZE = 50;
export const PLACEMENT_GAP = 0.04;

function addResetStyles() {
  css.global("html, body", {
    padding: 10,
    margin: 0,
    width: "100%",
    height: "100%"
  });

  css.global("body", {
    overflow: "hidden",
    userSelect: "none",
    backgroundColor: "#d3b698"
  });

  css.global("*", {
    boxSizing: "border-box"
  });
}
