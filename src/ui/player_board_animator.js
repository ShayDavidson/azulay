// @flow

import React, { Fragment } from "react";
// types
import type { Element } from "react";
import type { Player, Scoring } from "../models";
import type { Resolver } from "../actions";
// components
import PlayerBoard from "./player_board";
// helpers
import { createPlayer, immutablePredicateUpdate } from "../models";

/***********************************************************/

const ANIMATOR_DELAY = 1000;

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  resolver: ?Resolver,
  children: (player: Player) => Element<typeof PlayerBoard>
};

type State = {
  player: Player,
  currentScoringPhase: "none" | "prepare" | number | "leftovers" | "done"
};

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom") };

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.scoring != null) {
      return { currentScoringPhase: "prepare" };
    } else {
      return { player: nextProps.player, currentScoringPhase: "none" };
    }
  }

  componentDidUpdate(_, { player }) {
    const { currentScoringPhase } = this.state;
    if (this.props.scoring != null && currentScoringPhase != null) {
      const { scoring } = this.props;
      if (currentScoringPhase == "prepare") {
        this.setStateInDelay({ currentScoringPhase: 0 });
      } else if (Number.isInteger(currentScoringPhase)) {
        if (currentScoringPhase >= scoring.forTiles.length) {
          this.setStateInDelay({ currentScoringPhase: "leftovers" });
        } else {
          const scoringForTile = scoring.forTiles[currentScoringPhase];
          this.setStateInDelay({
            currentScoringPhase: currentScoringPhase + 1,
            player: {
              ...player,
              score: scoringForTile.totalScoreAfter,
              board: {
                ...player.board,
                wall: scoringForTile.wall,
                staging: immutablePredicateUpdate(player.board.staging, (_, index) => index <= scoringForTile.row, [])
              }
            }
          });
        }
      } else if (currentScoringPhase == "leftovers") {
        this.setStateInDelay({
          currentScoringPhase: "done",
          player: this.props.player
        });
      } else if (currentScoringPhase == "done") {
        if (this.props.resolver != null) {
          this.setState(
            ({ player }) => {
              "none", player;
            },
            () => setTimeout(() => this.props.resolver(), ANIMATOR_DELAY)
          );
        }
      }
    }
  }

  setStateInDelay(state) {
    setTimeout(() => this.setState(state), ANIMATOR_DELAY);
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
