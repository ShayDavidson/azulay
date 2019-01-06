// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Wall as WallType } from "../models";
import type { Highlights } from "../ui_models";
// components
import Placement from "./placement";
// helpers
import { COLORS, getWallPlacementColor } from "../models";
import { PLACEMENT_GAP } from "../styles";

/***********************************************************/

type Props = {
  wall: WallType,
  highlights?: ?Highlights
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
              const tile = this.props.wall[row][col];
              const highlighted =
                this.props.highlights != null &&
                this.props.highlights.tiles != null &&
                this.props.highlights.tiles.includes(tile);
              const highlightType =
                this.props.highlights != null ? (this.props.highlights.bonus ? "bonus" : "scoring") : "selection";
              return (
                <Placement
                  color={color}
                  key={key}
                  tile={tile}
                  highlighted={highlighted}
                  highlightType={highlightType}
                />
              );
            });
          })}
        </div>
      </div>
    );
  }
}
