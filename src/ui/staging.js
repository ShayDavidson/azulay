// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Staging as StagingType } from "../models";
// components
import Placement from "./placement";
import { GameContext } from "../game_provider";
// helpers
import { placementsForStagingRow, canPlaceTilesInStagingRow, COLORS } from "../models";
import { PLACEMENT_GAP } from "../styles";
import { getPutTilesFromFactoryIntoStagingRowAction } from "../actions";

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
        {({ gameState, uiState, dispatch }) => {
          return (
            <div className={$containerStyle}>
              {this.props.staging.map((stagingRow, stagingRowIndex) => {
                let canPlaceInStagingRow =
                  this.props.selectionEnabled &&
                  uiState.selectedTile &&
                  canPlaceTilesInStagingRow(
                    gameState.players[gameState.currentPlayer],
                    stagingRowIndex,
                    uiState.selectedFactory,
                    uiState.selectedTile
                  );
                return (
                  <div
                    className={$stagingRowStyle}
                    key={stagingRowIndex}
                    onClick={() => {
                      if (canPlaceInStagingRow) {
                        dispatch(getPutTilesFromFactoryIntoStagingRowAction(stagingRowIndex));
                      }
                    }}
                  >
                    {[...Array(placementsForStagingRow(stagingRowIndex))].map((_, col) => (
                      <Placement tile={stagingRow[col]} key={col} highlighted={canPlaceInStagingRow} />
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
