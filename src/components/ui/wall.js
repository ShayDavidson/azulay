// @flow

import React from "react";
import { css } from "glamor";

/***********************************************************/

import Placement from "./placement";
import { BOARD_TILE_SIZE } from "../../styles";
import { COLORS, getWallPlacementColor } from "../../models";
import type { Wall as WallModel } from "../../models";

/***********************************************************/

const PLACEMENT_GAP = "0.04em";

/***********************************************************/

type Props = {
  wall: WallModel
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  display: "grid",
  fontSize: BOARD_TILE_SIZE,
  gridTemplateColumns: `repeat(${COLORS}, ${BOARD_TILE_SIZE}px)`,
  gridTemplateRows: `repeat(${COLORS}, ${BOARD_TILE_SIZE}px)`,
  gridRowGap: PLACEMENT_GAP,
  gridColumnGap: PLACEMENT_GAP
});

/***********************************************************/

export default class Wall extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        {[...Array(COLORS)].map((_, row) => {
          return [...Array(COLORS)].map((_, col) => {
            let key = `${row}:${col}`;
            let color = getWallPlacementColor(row, col);
            return <Placement color={color} hasTileOfColor={color} key={key} />;
          });
        })}
      </div>
    );
  }
}
