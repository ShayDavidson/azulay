// @flow

import React, { Fragment } from "react";
// types
import type { Element } from "react";
import type { Player, Scoring } from "../models";
import type { Resolver } from "../actions";
// components
import PlayerBoard from "./player_board";
// helpers
import { createPlayer } from "../models";

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  resolver: ?Resolver,
  children: (player: Player) => Element<typeof PlayerBoard>
};

type State = {
  player: Player
};

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom") };

  static getDerivedStateFromProps(nextProps: Props) {
    // if (nextProps.scoring) {
    // }
    return { player: nextProps.player };
  }

  componentDidUpdate(prevProps: Props) {
    const { resolver } = this.props;
    if (resolver != null && resolver != prevProps.resolver) {
      setTimeout(() => {
        resolver();
      }, 1000);
    }
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
