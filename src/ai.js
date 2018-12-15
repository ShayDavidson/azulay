// @flow

import type { Tile, Factory, Game, Player } from "./models";
import { PLAYER_TYPE, getCurrentPlayer, tilesComparator, canPlaceTilesInStagingRow } from "./models";

// TYPES ////////////////////////////

export type AI = {|
  pending: boolean,
  chosenMove?: ?Move
|};

export type FactorySelection = {|
  selectedFactory: Factory,
  selectedTile: Tile
|};

export type Move = {|
  selectedFactory: Factory,
  selectedTile: Tile,
  selectedTarget: number | "floor"
|};

// API ////////////////////////////

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

export function isAIPlayer(player: Player): boolean {
  return player.type == PLAYER_TYPE.aiRandom || player.type == PLAYER_TYPE.aiSmart;
}

// HELPERS ////////////////////////////

function reduceFactorySelections(factory: Factory): Array<FactorySelection> {
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

function uniqueFactorySelectionsByTile(factorySelections: Array<FactorySelection>): Array<FactorySelection> {
  return factorySelections.reduce((result, selection) => {
    if (!result.find(addedSelection => tilesComparator(addedSelection.selectedTile, selection.selectedTile) == 0)) {
      result.push(selection);
    }
    return result;
  }, []);
}

// AI ////////////////////////////

function getAIMove(game: Game): Promise<Move> {
  const moves = getAllMoves(game);
  return new Promise(resolve => {
    const randomIndex = Math.floor(Math.random() * moves.length);
    resolve(moves[randomIndex]);
  });
}
