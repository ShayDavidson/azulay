// @flow

import Promise from "bluebird";
import { trackAction } from "./tracking.js";

// types
import type { Game, Tile, Factory, Floor } from "./models";
import type { UI, Presentation, Config } from "./ui_models";
import type { AI } from "./ai";

// action handlers
import {
  PHASES,
  drawTileFromBagIntoFactories,
  moveToPlacementPhase,
  areAllFactoriesFull,
  putTilesFromFactoryIntoFloor,
  putTilesFromFactoryIntoStagingRow,
  moveToNextPlayer,
  moveToScoringPhase,
  moveToRefillPhase,
  shuffleBoxIntoBag,
  moveToEndPhase,
  endTurn,
  shouldGameBeOver,
  getCurrentPlayer,
  hasPlayersThatNeedsScoring,
  scoreBoardForCurrentPlayer,
  areAllFactoriesEmpty,
  canPlaceTilesInStagingRow,
  getBoardScoring
} from "./models";
// helpers
import { play, playRandom, TILES, CLICK, SHUFFLE, END } from "./sfx";
import { isAIPlayer } from "./ai";

/***********************************************************/

export type Action = {
  type: ActionName,
  manualResolve?: boolean
};

export type ActionWithTileSelection = Action & {|
  payload: {|
    factory: Factory,
    tile: Tile
  |}
|};

export type ActionWithRowSelection = Action & {|
  payload: {|
    stagingRowIndex: number
  |}
|};

export type ActionName = $Values<typeof ACTIONS>;
export type ActionDispatcher = (action: Action) => Promise<any>;
export type ActionPromiseDispatcher = (actionPromise: ActionDispatcherPromise) => Promise<any>;
export type ActionDispatcherPromise = (
  wrapAction: ActionDispatcher,
  dispatcher: ActionPromiseDispatcher,
  getState: () => State
) => Promise<any>;

export type ValidationError = Error & {
  action?: Action,
  state?: State,
  fallbackAction?: ActionDispatcherPromise
};

export type Resolver = (thenableOrResult?: any) => void;

export type State = {|
  game: Game,
  ui: UI,
  presentation: Presentation,
  config: Config,
  ai: ?AI,
  resolver?: Resolver
|};

/***********************************************************/

function waitForUserInteraction() {}
function finito() {}

/***********************************************************/

export const ACTIONS = {
  drawTileFromBagIntoFactories: "drawTileFromBagIntoFactories",
  moveToPlacementPhase: "moveToPlacementPhase",
  selectTileInFactory: "selectTileInFactory",
  putTilesFromFactoryIntoFloor: "putTilesFromFactoryIntoFloor",
  putTilesFromFactoryIntoStagingRow: "putTilesFromFactoryIntoStagingRow",
  moveToNextPlayerPlacement: "moveToNextPlayerPlacement",
  requestAIMove: "requestAIMove",
  moveToScoringPhase: "moveToScoringPhase",
  moveToNextPlayerScoring: "moveToNextPlayerScoring",
  scoreBoardForCurrentPlayer: "scoreBoardForCurrentPlayer",
  endTurn: "endTurn",
  moveToRefillPhase: "moveToRefillPhase",
  shuffleBoxIntoBag: "shuffleBoxIntoBag",
  moveToEndPhase: "moveToEndPhase"
};

/***********************************************************/

export function reduce(state: State, action: Action): State {
  const { game, ui } = state;
  const { selectedFactory, selectedTile } = ui;

  switch (action.type) {
    case ACTIONS.drawTileFromBagIntoFactories: {
      return { ...state, game: drawTileFromBagIntoFactories(game) };
    }

    case ACTIONS.moveToPlacementPhase: {
      return { ...state, game: moveToPlacementPhase(game) };
    }

    case ACTIONS.selectTileInFactory: {
      action = ((action: any): ActionWithTileSelection);
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedFactory: isDeselect(action, ui) ? undefined : action.payload.factory,
          selectedTile: isDeselect(action, ui) ? undefined : action.payload.tile
        }
      };
    }

    case ACTIONS.putTilesFromFactoryIntoFloor: {
      if (selectedFactory != undefined && selectedTile != undefined) {
        return {
          ...state,
          game: putTilesFromFactoryIntoFloor(game, selectedFactory, selectedTile),
          ui: { ...state.ui, selectedFactory: undefined, selectedTile: undefined },
          presentation: { ...state.presentation, currentScoring: undefined }
        };
      } else {
        return state;
      }
    }

    case ACTIONS.putTilesFromFactoryIntoStagingRow: {
      action = ((action: any): ActionWithRowSelection);
      if (selectedFactory != undefined && selectedTile != undefined && action.payload.stagingRowIndex != undefined) {
        return {
          ...state,
          game: putTilesFromFactoryIntoStagingRow(game, action.payload.stagingRowIndex, selectedFactory, selectedTile),
          ui: { ...state.ui, selectedFactory: undefined, selectedTile: undefined },
          presentation: { ...state.presentation, currentScoring: undefined }
        };
      } else {
        return state;
      }
    }

    case ACTIONS.moveToNextPlayerPlacement: {
      return { ...state, game: moveToNextPlayer(game) };
    }

    case ACTIONS.requestAIMove: {
      return state;
    }

    case ACTIONS.moveToScoringPhase: {
      return { ...state, game: moveToScoringPhase(game) };
    }

    case ACTIONS.moveToNextPlayerScoring: {
      return {
        ...state,
        game: moveToNextPlayer(game),
        presentation: { ...state.presentation, currentScoring: undefined }
      };
    }

    case ACTIONS.scoreBoardForCurrentPlayer: {
      const scoring = getBoardScoring(getCurrentPlayer(game));
      return {
        ...state,
        game: scoreBoardForCurrentPlayer(game, scoring),
        presentation: { ...state.presentation, currentScoring: scoring }
      };
    }

    case ACTIONS.endTurn: {
      return {
        ...state,
        game: endTurn(game),
        presentation: { ...state.presentation, currentScoring: undefined }
      };
    }

    case ACTIONS.moveToRefillPhase: {
      return { ...state, game: moveToRefillPhase(game) };
    }

    case ACTIONS.shuffleBoxIntoBag: {
      return { ...state, game: shuffleBoxIntoBag(game) };
    }

    case ACTIONS.moveToEndPhase: {
      return {
        ...state,
        game: moveToEndPhase(game),
        presentation: { ...state.presentation, currentScoring: undefined }
      };
    }

    default:
      return state;
  }
}

/***********************************************************/

export function validate(state: State, action: Action): ?ValidationError {
  const { game, ui } = state;
  const { type } = action;
  let error: ?ValidationError;
  let fallbackAction: ?ActionDispatcherPromise;

  switch (type) {
    case ACTIONS.drawTileFromBagIntoFactories: {
      if (areAllFactoriesFull(game)) {
        error = new Error("factories are full");
        fallbackAction = getMoveToPlacementPhaseAction();
      } else if (game.bag.length == 0) {
        error = new Error("bag is empty");
        if (game.box.length == 0) {
          fallbackAction = getMoveToPlacementPhaseAction();
        } else {
          fallbackAction = getShuffleBoxIntoBagAction();
        }
      } else if (game.phase != PHASES.refill) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.moveToPlacementPhase: {
      if (game.phase != PHASES.refill) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.selectTileInFactory: {
      if (game.phase != PHASES.placement) {
        error = new Error("can't interact while refilling tiles");
      }
      break;
    }

    case ACTIONS.putTilesFromFactoryIntoFloor: {
      const { selectedFactory, selectedTile } = ui;
      if (selectedFactory == null || selectedTile == null) {
        error = new Error("no selected tile in factory");
      } else if (game.phase != PHASES.placement) {
        error = new Error("can't put tile in board in this phase");
      }
      break;
    }

    case ACTIONS.putTilesFromFactoryIntoStagingRow: {
      action = ((action: any): ActionWithRowSelection);
      const { selectedFactory, selectedTile } = ui;
      if (selectedFactory == null || selectedTile == null) {
        error = new Error("no selected tile in factory");
      } else if (action.payload.stagingRowIndex == null) {
        error = new Error("no selected staging row");
      } else if (game.phase != PHASES.placement) {
        error = new Error("can't put tile in board in this phase");
      } else if (selectedTile.kind == "first") {
        error = new Error("can't put first tile in staging");
      } else if (!canPlaceTilesInStagingRow(getCurrentPlayer(game), action.payload.stagingRowIndex, selectedTile)) {
        error = new Error("staging area cannot contain tile");
      }
      break;
    }

    case ACTIONS.moveToNextPlayerPlacement: {
      if (game.phase != PHASES.placement) {
        error = new Error("not in right phase");
      } else if (areAllFactoriesEmpty(game)) {
        error = new Error("factories are empty");
        fallbackAction = getMoveToScoringPhaseAction();
      }
      break;
    }

    case ACTIONS.requestAIMove: {
      // TODO
      break;
    }

    case ACTIONS.moveToScoringPhase: {
      if (game.phase != PHASES.placement) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.moveToNextPlayerScoring: {
      if (game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      } else if (!hasPlayersThatNeedsScoring(game)) {
        error = new Error("shown scoring for all players");
        if (shouldGameBeOver(game)) {
          fallbackAction = getMoveToEndPhaseAction();
        } else {
          fallbackAction = getEndTurnAction();
        }
      }
      break;
    }

    case ACTIONS.scoreBoardForCurrentPlayer: {
      if (game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.endTurn: {
      // TODO
      break;
    }

    case ACTIONS.moveToRefillPhase: {
      if (game.phase != undefined && game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.shuffleBoxIntoBag: {
      if (game.phase != PHASES.refill) {
        error = new Error("not in right phase");
      } else if (game.bag.length != 0) {
        error = new Error("bag is not emtpy");
      }
      break;
    }

    case ACTIONS.moveToEndPhase: {
      if (game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      } else if (!shouldGameBeOver(game)) {
        error = new Error("game should not be over yet");
      }
      break;
    }
  }

  if (error) {
    error.state = state;
    error.action = action;
    (error: any).fallbackAction = fallbackAction; // casting due to weird flowtype issue
  }

  return error;
}

/***********************************************************/

export function isDeselect(action: ActionWithTileSelection, ui: UI): boolean {
  return action.payload.factory &&
    action.payload.factory == ui.selectedFactory &&
    action.payload.tile &&
    action.payload.tile == ui.selectedTile
    ? true
    : false;
}

/***********************************************************/

export function getDrawTileFromBagIntoFactoriesAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.drawTileFromBagIntoFactories
    })
      .then(() => playRandom(TILES))
      .delay(75 * getState().config.animationSpeed)
      .then(() => dispatch(getDrawTileFromBagIntoFactoriesAction()));
  };
}

export function getMoveToPlacementPhaseAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToPlacementPhase
    })
      .then(() => trackAction(ACTIONS.moveToPlacementPhase, getState().game))
      .then(waitForUserInteraction);
  };
}

export function getSelectTileInFactoryAction(factory: Factory, tile: Tile): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.selectTileInFactory,
      payload: {
        factory,
        tile
      }
    })
      .then(() => trackAction(ACTIONS.selectTileInFactory, getState().game))
      .then(() => play(CLICK))
      .then(waitForUserInteraction);
  };
}

export function getPutTilesFromFactoryIntoFloorAction(floor: Floor): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.putTilesFromFactoryIntoFloor,
      payload: { floor }
    })
      .then(() => trackAction(ACTIONS.putTilesFromFactoryIntoFloor, getState().game))
      .then(() => playRandom(TILES))
      .then(() => dispatch(getMoveToNextPlayerPlacementAction()));
  };
}

export function getPutTilesFromFactoryIntoStagingRowAction(stagingRowIndex: number): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.putTilesFromFactoryIntoStagingRow,
      payload: {
        stagingRowIndex
      }
    })
      .then(() => trackAction(ACTIONS.putTilesFromFactoryIntoStagingRow, getState().game))
      .then(() => playRandom(TILES))
      .then(() => dispatch(getMoveToNextPlayerPlacementAction()));
  };
}

export function getMoveToNextPlayerPlacementAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToNextPlayerPlacement
    })
      .then(() => trackAction(ACTIONS.moveToNextPlayerPlacement, getState().game))
      .then(() => {
        const currentPlayer = getCurrentPlayer(getState().game);
        if (isAIPlayer(currentPlayer)) {
          return dispatch(getRequestAIMoveAction());
        }
      });
  };
}

export function getRequestAIMoveAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.requestAIMove,
      manualResolve: true,
      payload: {}
    })
      .then(() => trackAction(ACTIONS.requestAIMove, getState().game))
      .then(() => {
        // TODO
      });
  };
}

export function getMoveToScoringPhaseAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToScoringPhase
    })
      .then(() => trackAction(ACTIONS.moveToScoringPhase, getState().game))
      .delay(500 * getState().config.animationSpeed)
      .then(() => dispatch(getMoveToNextPlayerScoringAction()));
  };
}

export function getMoveToNextPlayerScoringAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToNextPlayerScoring
    })
      .then(() => trackAction(ACTIONS.moveToNextPlayerScoring, getState().game))
      .delay(500 * getState().config.animationSpeed)
      .then(() => dispatch(getScoreBoardForCurrentPlayerAction()));
  };
}

export function getScoreBoardForCurrentPlayerAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.scoreBoardForCurrentPlayer,
      manualResolve: true
    })
      .then(() => trackAction(ACTIONS.scoreBoardForCurrentPlayer, getState().game))
      .delay(500 * getState().config.animationSpeed)
      .then(() => dispatch(getMoveToNextPlayerScoringAction()));
  };
}

export function getEndTurnAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.endTurn
    })
      .then(() => trackAction(ACTIONS.endTurn, getState().game))
      .delay(100 * getState().config.animationSpeed)
      .then(() => dispatch(getMoveToRefillPhaseAction()));
  };
}

export function getMoveToRefillPhaseAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToRefillPhase
    })
      .then(() => trackAction(ACTIONS.moveToRefillPhase, getState().game))
      .then(() => dispatch(getDrawTileFromBagIntoFactoriesAction()));
  };
}

export function getShuffleBoxIntoBagAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.shuffleBoxIntoBag
    })
      .then(() => trackAction(ACTIONS.shuffleBoxIntoBag, getState().game))
      .then(() => play(SHUFFLE))
      .delay(500 * getState().config.animationSpeed)
      .then(() => dispatch(getDrawTileFromBagIntoFactoriesAction()));
  };
}

export function getMoveToEndPhaseAction(): ActionDispatcherPromise {
  return (wrapAction, dispatch, getState) => {
    return wrapAction({
      type: ACTIONS.moveToEndPhase
    })
      .then(() => trackAction(ACTIONS.moveToEndPhase, getState().game))
      .then(() => play(END))
      .then(finito);
  };
}
