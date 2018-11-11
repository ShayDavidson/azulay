// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Floor as FloorType } from "../../models";
// components
import Placement from "./placement";
import { GameContext } from "../game_provider";
// helpers
import { FLOOR_SLOTS } from "../../models";
import { PLACEMENT_GAP } from "../../styles";

/***********************************************************/

type Props = {
  floor: FloorType,
  selectionEnabled?: boolean
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${FLOOR_SLOTS.length}, 1em)`,
  gridTemplateRows: `repeat(1, 1em)`,
  gridGap: `${PLACEMENT_GAP}em`
});

/***********************************************************/

export default class Floor extends React.Component<Props, State> {
  render() {
    return (
      <GameContext.Consumer>
        {({ uiState }) => {
          let canPlaceInFloor = this.props.selectionEnabled && uiState.selectedTile;
          return (
            <div className={$baseStyle}>
              {FLOOR_SLOTS.map((score, index) => (
                <Placement label={score.toString()} highlighted={canPlaceInFloor} key={index} />
              ))}
            </div>
          );
        }}
      </GameContext.Consumer>
    );
  }
}
