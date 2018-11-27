// @flow

import type { Tile, Factory, Game } from "./models";
import { getCurrentPlayer, tilesComparator, canPlaceTilesInStagingRow } from "./models";

// TYPES ////////////////////////////

export type FactorySelection = {|
  selectedFactory: Factory,
  selectedTile: Tile
|};

export type Move = {|
  selectedFactory: Factory,
  selectedTile: Tile,
  selectedTarget: number | "floor"
|};

// FUNCTIONS ////////////////////////////

export function getAllMoves(game: Game): Array<Move> {
  const player = getCurrentPlayer(game);
  const leftoverSelections: Array<FactorySelection> = reduceFactorySelections(game.leftovers);
  const factorySelections: Array<FactorySelection> = game.factories.reduce((results, factory) => {
    return results.concat(reduceFactorySelections(factory));
  }, []);

  const allSelections = leftoverSelections.concat(factorySelections);

  return allSelections.reduce((moves, selection) => {
    const selectionMoves = player.board.staging.reduce(
      (relevantMoves, stagingRow, stagingRowIndex) => {
        if (canPlaceTilesInStagingRow(player, stagingRowIndex, selection.selectedTile)) {
          relevantMoves.push({ ...selection, selectedTarget: stagingRowIndex });
        }
        return relevantMoves;
      },
      [{ ...selection, selectedTarget: "floor" }]
    );
    return moves.concat(selectionMoves);
  }, []);
}

export function reduceFactorySelections(factory: Factory): Array<FactorySelection> {
  return uniqueFactorySelectionsByTile(
    factory.reduce((results, tile) => {
      results.push({
        selectedFactory: factory,
        selectedTile: tile
      });
      return results;
    }, [])
  );
}

export function uniqueFactorySelectionsByTile(factorySelections: Array<FactorySelection>): Array<FactorySelection> {
  return factorySelections.reduce((result, selection) => {
    if (!result.find(addedSelection => tilesComparator(addedSelection.selectedTile, selection.selectedTile) == 0)) {
      result.push(selection);
    }
    return result;
  }, []);
}

// AI ////////////////////////////
