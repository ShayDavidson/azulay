// @flow

import React, { Fragment } from "react";
// types
import type { Element } from "react";
import type { Player, Scoring, TilesArray } from "../models";
import type { Resolver } from "../actions";
// components
import PlayerBoard from "./player_board";
// helpers
import { createPlayer, immutablePredicateUpdate } from "../models";
import { SCORE, TILES, play, playRandom } from "../sfx";

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  resolver: ?Resolver,
  children: (player: Player) => Element<typeof PlayerBoard>
};

type State = {
  scoringActs?: [ScoringAct],
  scoringActsStep?: number,
  player: Player
};

type ScoringAct = {
  kind: "row" | "leftovers",
  phase?: "prepare" | "place" | "scoreRow" | "scoreCol" | "scoreRowBonus" | "scoreColBonus" | "scoreColorBonus",
  sideEffect?: Function,
  duration: number,
  rowIndex?: number,
  colIndex?: number,
  leftoverIndex?: number,
  step?: number,
  player: Player,
  scoringTiles?: TilesArray,
  deltaScore?: number
};

/***********************************************************/

function deriveScoringAct(scoring: Scoring, originalPlayer: Player): [ScoringAct] {
  let scoringForStagingRows = scoring.forTiles.reduce((act, element) => {
    let lastStep = act[act.length - 1] ? act[act.length - 1].step : 0;

    act.push({
      kind: "row",
      phase: "prepare",
      duration: 100,
      rowIndex: element.row,
      player: originalPlayer
    });

    const newPlayerBoardAfterPlacement = {
      ...originalPlayer.board,
      wall: element.wall,
      staging: immutablePredicateUpdate(originalPlayer.board.staging, (_, index) => index <= element.row, [])
    };

    act.push({
      kind: "row",
      phase: "place",
      duration: 250,
      sideEffect: () => playRandom(TILES),
      rowIndex: element.row,
      colIndex: element.col,
      player: { ...originalPlayer, board: newPlayerBoardAfterPlacement }
    });

    return act;
  }, []);
  return scoringForStagingRows;
}

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom"), currentScoring: { phase: "none", count: 0 } };

  static getDerivedStateFromProps(nextProps: Props, state: State): State {
    if (nextProps.scoring != null) {
      const prevPlayer = state.player;
      return { player: prevPlayer, scoringAct: deriveScoringAct(nextProps.scoring, prevPlayer), scoringActStep: 0 };
    } else {
      return { player: nextProps.player };
    }
  }

  componentDidUpdate(_: Props, { scoringActs, scoringActsStep }: State) {
    if (scoringActs != null && scoringActsStep != null) {
      if (scoringActsStep < scoringActs.length) {
        const actStep = scoringActs[scoringActsStep];
        if (actStep.sideEffect) {
          actStep.sideEffect();
        }
        setTimeout(() => {
          this.setState(state => {
            return { ...state, scoringActsStep: state.scoringActsStep + 1 };
          });
        }, actStep.duration);
      } else if (this.props.resolver != null) {
        this.props.resolver();
      }
    }
  }

  render() {
    return <Fragment>{this.props.children(this.state.player)}</Fragment>;
  }
}
