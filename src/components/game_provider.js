// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type { Game } from "../models";
// helpers
import { createGame, drawTileFromBagIntoFactories, moveToPlacementPhase, areAllFactoriesFull, PHASES } from "../models";
import { playRandom, TILES } from "../sfx";

/***********************************************************/

export const GameContext: Object = React.createContext();

/***********************************************************/

type Props = {
  players: number,
  seed: number,
  children?: Node
};

type State = Game;

/***********************************************************/

export default class GameProvider extends React.Component<Props, State> {
  state = GameProvider.getDerivedStateFromProps({ players: 0, seed: 0 });

  static getDerivedStateFromProps(nextProps: Props) {
    const { players, seed } = nextProps;
    return createGame(players, seed);
  }

  componentDidMount() {
    this.progressGame();
  }

  progressGame() {
    if (this.state.phase == PHASES.refill) {
      if (areAllFactoriesFull(this.state)) {
        this.dispatch(moveToPlacementPhase).then(this.progressGame.bind(this));
      } else {
        this.dispatch(drawTileFromBagIntoFactories)
          .delay(100)
          .then(() => playRandom(TILES))
          .then(this.progressGame.bind(this));
      }
    }
  }

  dispatch(action: Game => Game) {
    return new Promise(resolve => {
      this.setState(action, () => resolve());
    });
  }

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state,
          dispatch: this.dispatch.bind(this)
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
