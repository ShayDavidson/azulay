// @flow

import React, { Component } from "react";
import { css } from "glamor";
import Color from "color";

/***********************************************************/

import Tile from "./tile";

import { TILE_COLORS, BOARD_TILE_SIZE } from "../styles";
import { COLORS, getWallPlacementColor } from "../models";
import type { Wall as WallModel } from "../models";

/***********************************************************/

const PLACEMENT_GAP = "0.03em";
const BORDER_RADIUS = "0.12em";

type Props = {
  wall: WallModel
};

type State = {
  /* ... */
};

const $wall = css({
  display: "grid",
  fontSize: BOARD_TILE_SIZE,
  gridTemplateColumns: `repeat(${COLORS}, ${BOARD_TILE_SIZE}px)`,
  gridTemplateRows: `repeat(${COLORS}, ${BOARD_TILE_SIZE}px)`,
  gridRowGap: PLACEMENT_GAP,
  gridColumnGap: PLACEMENT_GAP
});

const $placement = css({
  borderRadius: BORDER_RADIUS,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

export default class Wall extends Component<Props, State> {
  renderCells() {}

  render() {
    return (
      <div className={$wall}>
        {[...Array(COLORS)].map((_, row) => {
          return [...Array(COLORS)].map((_, col) => {
            let color = getWallPlacementColor(row, col);
            let placementStyle = {
              backgroundColor: Color(TILE_COLORS[color])
                .desaturate(0.5)
                .toString()
            };
            return (
              <div className={$placement} style={placementStyle} key={`${row}:${col}`}>
                <Tile color={color} />
              </div>
            );
          });
        })}
      </div>
    );
  }
}
