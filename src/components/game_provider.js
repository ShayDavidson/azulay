// @flow

import React from "react";
import type { Node } from "react";
// types
import type { Game } from "../models";
// helpers
import { createGame } from "../models";

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

  render() {
    return <GameContext.Provider value={this.state}>{this.props.children}</GameContext.Provider>;
  }
}
