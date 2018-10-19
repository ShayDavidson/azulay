// @flow

import React from "react";
import type { Node } from "react";

/***********************************************************/

import type { Game } from "../models";

/***********************************************************/

export const GameContext = React.createContext();

/***********************************************************/

type Props = {
  children?: Node
};

type State = Game;

/***********************************************************/

export default class GameProvider extends React.Component<Props, State> {
  render() {
    return <GameContext.Provider value={this.state}>{this.props.children}</GameContext.Provider>;
  }
}
