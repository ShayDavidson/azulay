// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type { State, Action } from "../actions";
// helpers
import { createGame, areAllFactoriesFull, PHASES } from "../models";
import { createResetUI } from "../ui_models";
import { reduce, validate, getDrawTileFromBagIntoFactoriesAction, getMoveToPlacementPhaseAction } from "../actions";
import { playRandom, TILES } from "../sfx";

/***********************************************************/

export const GameContext: Object = React.createContext();

/***********************************************************/

type Props = {
  players: number,
  seed: number,
  log?: boolean,
  children?: Node
};

/***********************************************************/

export default class GameProvider extends React.Component<Props, State> {
  state = GameProvider.getDerivedStateFromProps({ players: 0, seed: 0 });

  static getDerivedStateFromProps(nextProps: Props) {
    const { players, seed } = nextProps;
    return {
      game: createGame(players, seed),
      ui: createResetUI()
    };
  }

  componentDidMount() {
    this.progressGame();
  }

  progressGame() {
    let { game } = this.state;
    if (game.phase == PHASES.refill) {
      if (areAllFactoriesFull(game)) {
        this.dispatch(getMoveToPlacementPhaseAction()).then(this.progressGame.bind(this));
      } else {
        this.dispatch(getDrawTileFromBagIntoFactoriesAction())
          .delay(100)
          .then(() => playRandom(TILES))
          .then(this.progressGame.bind(this));
      }
    }
  }

  dispatch(action: Action) {
    let state = this.state;
    return new Promise((resolve, reject) => {
      let validationError = validate(state, action);
      if (validationError) {
        reject(validationError);
        return;
      }

      this.setState(
        prevState => {
          const newState = reduce(prevState, action);
          if (this.props.log) {
            console.log({
              type: action.type,
              action,
              prevState,
              newState
            });
          }
          return newState;
        },
        () => resolve()
      );
    })
      .then(() => this.progressGame())
      .catch(validationError => console.warn(validationError.message, action, state));
  }

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state.game,
          uiState: this.state.ui,
          dispatch: this.dispatch.bind(this)
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
