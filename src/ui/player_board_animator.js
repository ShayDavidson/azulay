// @flow

import React, { Fragment } from "react";
// types
import type { Element } from "react";
import type { Player, Scoring } from "../models";
// components
import PlayerBoard from "./player_board";
// helpers
import { createPlayer } from "../models";

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  children: (player: Player) => Element<typeof PlayerBoard>
};

type State = {
  player: Player
};

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "cpu") };

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.scoring) {
      debugger;
    }
    return { player: nextProps.player };
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
