// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Staging as StagingType } from "../../models";
// components
import Placement from "./placement";
import { GameContext } from "../game_provider";
// helpers
import { placementsForStagingRow, canPlaceTilesInStagingRow, COLORS } from "../../models";
import { PLACEMENT_GAP } from "../../styles";

/***********************************************************/

type Props = {
  staging: StagingType,
  selectionEnabled?: boolean
};

type State = {
  /* ... */
};

// /***********************************************************/

const $containerStyle = css({
  width: "max-content"
});

const $stagingRowStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${COLORS}, 1em)`,
  gridTemplateRows: `repeat(1, 1em)`,
  gridGap: `${PLACEMENT_GAP}em`,
  justifyContent: "end",
  direction: "rtl",
  ":not(:last-child)": { marginBottom: `${PLACEMENT_GAP}em` }
});

/***********************************************************/

export default class Staging extends React.Component<Props, State> {
  render() {
    return (
      <GameContext.Consumer>
        {({ gameState, uiState }) => {
          return (
            <div className={$containerStyle}>
              {this.props.staging.map((stagingRow, index) => {
                let canPlaceInStagingRow =
                  this.props.selectionEnabled &&
                  uiState.selectedTile &&
                  canPlaceTilesInStagingRow(gameState.players[gameState.currentPlayer], index, uiState.selectedTile, 1);
                return (
                  <div className={$stagingRowStyle} key={index}>
                    {[...Array(placementsForStagingRow(index))].map((_, col) => (
                      <Placement key={col} highlighted={canPlaceInStagingRow} />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        }}
      </GameContext.Consumer>
    );
  }
}
