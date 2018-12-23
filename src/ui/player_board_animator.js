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

const ANIMATOR_DELAY = 500;

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  resolver: ?Resolver,
  children: (player: Player) => Element<typeof PlayerBoard>
};

type State = {
  player: Player,
  currentScoringPhase: "prepare" | number | "leftovers" | "done"
};

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom") };

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.scoring != null) {
      return { currentScoringPhase: "prepare" };
    } else {
      return { player: nextProps.player, currentScoringPhase: undefined };
    }
  }

  componentDidUpdate(/*_, prevState*/) {
    this.props.resolver();
    // const { currentScoringPhase } = this.state;
    // const { scoring } = this.props;
    // if (currentScoringPhase == "prepare") {
    //   this.setStateInDelay({ currentScoringPhase: 0 });
    // } else if (Number.isInteger(currentScoringPhase)) {
    //   if (currentScoringPhase >= scoring.forTile.length) {
    //     this.setStateInDelay({ currentScoringPhase: "leftovers" });
    //   } else {
    //     this.setStateInDelay({ currentScoringPhase: prevState.currentScoringPhase + 1 });
    //   }
    // } else if (currentScoringPhase == "leftovers") {
    //   // todo
    // } else if (currentScoringPhase == "done") {
    //   if (this.props.resolver != null) {
    //     this.props.resolver();
    //   }
    // }
  }

  setStateInDelay(state) {
    setTimeout(() => this.setState(state), ANIMATOR_DELAY);
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
