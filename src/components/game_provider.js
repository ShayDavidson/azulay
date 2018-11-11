// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type { Game } from "../models";
import type { UI } from "../ui_models";
// helpers
import { createGame, drawTileFromBagIntoFactories, moveToPlacementPhase, areAllFactoriesFull, PHASES } from "../models";
import { createResetUI } from "../ui_models";
import { playRandom, TILES } from "../sfx";

/***********************************************************/

export const GameContext: Object = React.createContext();

/***********************************************************/

type Props = {
  players: number,
  seed: number,
  children?: Node
};

type State = {
  game: Game,
  ui: UI
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
        this.dispatchGame(moveToPlacementPhase).then(this.progressGame.bind(this));
      } else {
        this.dispatchGame(drawTileFromBagIntoFactories)
          .delay(100)
          .then(() => playRandom(TILES))
          .then(this.progressGame.bind(this));
      }
    }
  }

  dispatchGame(action: Game => Game) {
    return new Promise(resolve => {
      this.setState(
        state => {
          return { game: action(state.game), ui: createResetUI() };
        },
        () => resolve()
      );
    });
  }

  dispatchUI(action: UI => UI) {
    return new Promise(resolve => {
      this.setState(
        state => {
          return { ui: action(state.ui) };
        },
        () => resolve()
      );
    });
  }

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state.game,
          uiState: this.state.ui,
          dispatch: { game: this.dispatchGame.bind(this), ui: this.dispatchUI.bind(this) }
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
