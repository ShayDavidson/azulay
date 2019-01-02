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
  currentScoringPhase: {
    phase: "none" | "prepare" | "row" | "leftovers" | "done",
    row?: number
  }
};

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom"), currentScoringPhase: { phase: "none" } };

  static getDerivedStateFromProps(nextProps: Props, state: State): State {
    if (nextProps.scoring != null) {
      return { ...state, currentScoringPhase: { phase: "prepare" } };
    } else {
      return { ...state, player: nextProps.player, currentScoringPhase: { phase: "none" } };
    }
  }

  componentDidUpdate({ player: finalPlayer }: Props, { player }: State) {
    const { currentScoringPhase } = this.state;
    console.log(player.name, currentScoringPhase, this.props.scoring);
    if (this.props.scoring != null && currentScoringPhase.phase != "none") {
      const { scoring } = this.props;
      if (currentScoringPhase.phase == "prepare") {
        this.setStateInDelay({ currentScoringPhase: { phase: "row", row: 0 }, player });
      } else if (currentScoringPhase.row != null) {
        if (currentScoringPhase.row >= scoring.forTiles.length) {
          this.setStateInDelay({ currentScoringPhase: { phase: "leftovers" }, player: finalPlayer });
        } else {
          const scoringForTile = scoring.forTiles[currentScoringPhase.row];
          this.setStateInDelay({
            currentScoringPhase: {
              phase: "row",
              row: currentScoringPhase.row + 1
            },
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
      } else if (currentScoringPhase.phase == "leftovers") {
        this.setStateInDelay({
          currentScoringPhase: { phase: "done" },
          player: finalPlayer
        });
      } else if (currentScoringPhase.phase == "done") {
        this.setState(
          ({ player }) => {
            return { currentScoringPhase: { phase: "none" }, player };
          },
          () =>
            setTimeout(() => {
              if (this.props.resolver != null) {
                this.props.resolver();
              }
            }, ANIMATOR_DELAY)
        );
      }
    }
  }

  setStateInDelay(state: State) {
    setTimeout(() => this.setState(state), ANIMATOR_DELAY);
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
