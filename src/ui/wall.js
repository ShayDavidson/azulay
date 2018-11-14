// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Wall as WallType } from "../models";
// components
import Placement from "./placement";
// helpers
import { COLORS, getWallPlacementColor } from "../models";
import { PLACEMENT_GAP } from "../styles";

/***********************************************************/

type Props = {
  wall: WallType
};

type State = {
  /* ... */
};

/***********************************************************/

const $containerStyle = css({
  width: "max-content"
});

const $baseStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${COLORS}, 1em)`,
  gridTemplateRows: `repeat(${COLORS}, 1em)`,
  gridGap: `${PLACEMENT_GAP}em`
});

/***********************************************************/

export default class Wall extends React.Component<Props, State> {
  render() {
    return (
      <div className={$containerStyle}>
        <div className={$baseStyle}>
          {[...Array(COLORS)].map((_, row) => {
            return [...Array(COLORS)].map((_, col) => {
              const key = `${row}:${col}`;
              const color = getWallPlacementColor(row, col);
              return <Placement color={color} key={key} />;
            });
          })}
        </div>
      </div>
    );
  }
}
