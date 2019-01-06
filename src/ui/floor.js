// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Floor as FloorType } from "../models";
import type { Highlights } from "../ui_models";
// components
import Placement from "./placement";
import { GameContext } from "../game_provider";
// helpers
import { FLOOR_SLOTS } from "../models";
import { PLACEMENT_GAP } from "../styles";
import { getPutTilesFromFactoryIntoFloorAction } from "../actions";
import { play, CLICK } from "../sfx";

/***********************************************************/

type Props = {
  floor: FloorType,
  selectionEnabled?: boolean,
  highlights?: ?Highlights
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
        {({ uiState, dispatch }) => {
          let canPlaceInFloor = this.props.selectionEnabled && uiState.selectedTile;
          return (
            <div
              className={$baseStyle}
              onClick={() => {
                dispatch(getPutTilesFromFactoryIntoFloorAction(this.props.floor)).then(() => play(CLICK));
              }}
            >
              {FLOOR_SLOTS.map((score, index) => (
                <Placement
                  tile={this.props.floor[index]}
                  label={score.toString()}
                  highlighted={canPlaceInFloor || !!this.props.highlights}
                  highlightType={this.props.highlights ? "minus" : "selection"}
                  key={index}
                />
              ))}
            </div>
          );
        }}
      </GameContext.Consumer>
    );
  }
}
