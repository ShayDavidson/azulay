// @flow

import React, { Fragment } from "react";
// types
import type { Element } from "react";
import type { Player, Scoring, TilesArray } from "../models";
import type { Resolver } from "../actions";
import type { Highlights } from "../ui_models";
// components
import PlayerBoard from "./player_board";
// helpers
import { createPlayer, immutablePredicateUpdate, isStagingRowFull, ROW_BONUS, COL_BONUS, COLOR_BONUS } from "../models";
import { SCORE, TILES, SCORE_BAD, play, playRandom } from "../sfx";

/***********************************************************/

type Props = {
  player: Player,
  scoring: ?Scoring,
  resolver: ?Resolver,
  children: (player: Player, highlights: ?Highlights) => Element<typeof PlayerBoard>
};

type State = {
  scoringActs?: [ScoringAct],
  scoringActsStep?: number,
  highlights?: ?Highlights,
  player: Player
};

/***********************************************************/

type ScoringAct = {
  kind: "prepare" | "row" | "floor",
  phase?: "prepare" | "place" | "score" | "scoreRow" | "scoreCol" | "scoreRowBonus" | "scoreColBonus" | "scoreColorBonus", // prettier-ignore
  sideEffect?: Function,
  delay: number,
  rowIndex?: number,
  colIndex?: number,
  scoringTiles?: TilesArray,
  totalScore?: number,
  deltaScore?: number,
  player: Player,
  step?: number
};

const DEFAULT_DELAY = 600;

function playScoreSfx(step) {
  play(SCORE[Math.min(step, 9)]);
}

function deriveHighlightsFromScoringAct(scoringAct: ScoringAct): ?Highlights {
  if (scoringAct.kind == "row" || scoringAct.kind == "floor") {
    return {
      type: scoringAct.kind,
      row: scoringAct.rowIndex,
      col: scoringAct.colIndex,
      bonus:
        scoringAct.phase == "scoreRowBonus" ||
        scoringAct.phase == "scoreColBonus" ||
        scoringAct.phase == "scoreColorBonus",
      tiles: scoringAct.scoringTiles
    };
  } else {
    return undefined;
  }
}

function deriveScoringAct(scoring: Scoring, originalPlayer: Player, finalPlayer: Player): [ScoringAct] {
  const acts = scoring.forTiles.reduce((acts, element) => {
    let step = acts[acts.length - 1] ? (acts[acts.length - 1]: ScoringAct).step + 1 : 0;

    const newPlayerBoardAfterPlacement = {
      ...originalPlayer.board,
      wall: element.wall,
      staging: immutablePredicateUpdate(
        originalPlayer.board.staging,
        (stagingRow, stagingRowIndex) =>
          isStagingRowFull(stagingRow, stagingRowIndex) && stagingRowIndex <= element.row,
        []
      )
    };

    acts.push({
      kind: "row",
      phase: "prepare",
      delay: DEFAULT_DELAY,
      rowIndex: element.row,
      colIndex: element.col,
      player: {
        ...originalPlayer,
        board: {
          ...originalPlayer.board,
          wall: element.wallBefore,
          staging: immutablePredicateUpdate(
            originalPlayer.board.staging,
            (stagingRow, stagingRowIndex) =>
              isStagingRowFull(stagingRow, stagingRowIndex) && stagingRowIndex < element.row,
            []
          )
        },
        score: element.totalScoreBefore
      }
    });

    acts.push({
      kind: "row",
      phase: "place",
      delay: DEFAULT_DELAY,
      sideEffect: () => playRandom(TILES),
      rowIndex: element.row,
      colIndex: element.col,
      player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: element.totalScoreBefore }
    });

    if (element.scoredSingleTile) {
      acts.push({
        kind: "row",
        phase: "score",
        delay: DEFAULT_DELAY,
        sideEffect: () => playScoreSfx(step),
        rowIndex: element.row,
        colIndex: element.col,
        scoringTiles: [element.placedTile],
        deltaScore: 1,
        totalScore: element.totalScoreAfter,
        player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: element.totalScoreAfter },
        step: step++
      });
    } else {
      let accumulatingScore = element.totalScoreBefore;
      if (element.rowScore > 0) {
        accumulatingScore += element.rowScore;
        acts.push({
          kind: "row",
          phase: "scoreRow",
          delay: DEFAULT_DELAY,
          sideEffect: () => playScoreSfx(step),
          rowIndex: element.row,
          colIndex: element.col,
          scoringTiles: element.scoringTilesInRow,
          deltaScore: element.rowScore,
          totalScore: accumulatingScore,
          player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: accumulatingScore },
          step: step++
        });
      }

      if (element.colScore > 0) {
        accumulatingScore += element.colScore;
        acts.push({
          kind: "row",
          phase: "scoreCol",
          delay: DEFAULT_DELAY,
          sideEffect: () => playScoreSfx(step),
          rowIndex: element.row,
          colIndex: element.col,
          scoringTiles: element.scoringTilesInCol,
          deltaScore: element.colScore,
          totalScore: accumulatingScore,
          player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: accumulatingScore },
          step: step++
        });
      }

      if (element.scoredEntireRow) {
        accumulatingScore += ROW_BONUS;
        acts.push({
          kind: "row",
          phase: "scoreRowBonus",
          delay: DEFAULT_DELAY,
          sideEffect: () => playScoreSfx(step),
          rowIndex: element.row,
          colIndex: element.col,
          scoringTiles: element.scoringTilesInRow,
          deltaScore: ROW_BONUS,
          totalScore: accumulatingScore,
          player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: accumulatingScore },
          step: step++
        });
      }

      if (element.scoredEntireCol) {
        accumulatingScore += COL_BONUS;
        acts.push({
          kind: "row",
          phase: "scoreColBonus",
          delay: DEFAULT_DELAY,
          sideEffect: () => playScoreSfx(step),
          rowIndex: element.row,
          colIndex: element.col,
          scoringTiles: element.scoringTilesInCol,
          deltaScore: COL_BONUS,
          totalScore: accumulatingScore,
          player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: accumulatingScore },
          step: step++
        });
      }

      if (element.scoredEntireColor) {
        accumulatingScore += COLOR_BONUS;
        acts.push({
          kind: "row",
          phase: "scoreColorBonus",
          delay: DEFAULT_DELAY,
          sideEffect: () => playScoreSfx(step),
          rowIndex: element.row,
          colIndex: element.col,
          scoringTiles: element.scoringTilesOfColor,
          deltaScore: COLOR_BONUS,
          totalScore: accumulatingScore,
          player: { ...originalPlayer, board: newPlayerBoardAfterPlacement, score: accumulatingScore },
          step: step++
        });
      }
    }

    return acts;
  }, []);

  if (scoring.floorScore != 0) {
    acts.push({
      kind: "floor",
      phase: "prepare",
      delay: DEFAULT_DELAY * 2,
      player: {
        ...finalPlayer,
        board: { ...finalPlayer.board, wall: scoring.finalWall, floor: originalPlayer.board.floor },
        score: scoring.totalScore - scoring.floorScore
      }
    });

    acts.push({
      kind: "floor",
      phase: "score",
      delay: DEFAULT_DELAY,
      sideEffect: () => play(SCORE_BAD),
      deltaScore: scoring.floorScore,
      totalScore: scoring.totalScore,
      player: finalPlayer
    });
  }

  return [{ kind: "prepare", delay: 100, player: originalPlayer }, ...acts];
}

/***********************************************************/

export default class PlayerBoardAnimator extends React.Component<Props, State> {
  state = { player: createPlayer("", "aiRandom") };

  static getDerivedStateFromProps(nextProps: Props, state: State): State {
    if (nextProps.scoring != null) {
      const prevPlayer = state.player;
      return {
        player: prevPlayer,
        scoringActs: deriveScoringAct(nextProps.scoring, prevPlayer, nextProps.player),
        scoringActsStep: 0
      };
    } else {
      return { player: nextProps.player, scoringActs: undefined, scoringActsStep: undefined, highlights: undefined };
    }
  }

  componentDidUpdate() {
    const { scoringActs, scoringActsStep } = (this.state: State);
    if (scoringActs != null && scoringActsStep != null) {
      if (scoringActsStep < scoringActs.length) {
        const actStep = scoringActs[scoringActsStep];
        setTimeout(() => {
          if (actStep.sideEffect) {
            actStep.sideEffect();
          }
          this.setState(state => {
            return {
              player: actStep.player,
              scoringActs: scoringActs,
              scoringActsStep: state.scoringActsStep + 1,
              highlights: deriveHighlightsFromScoringAct(actStep)
            };
          });
        }, actStep.delay);
      } else if (this.props.resolver != null) {
        this.props.resolver();
        this.setState(state => {
          return { player: state.player, scoringActs: undefined, scoringActsStep: undefined, highlights: undefined };
        });
      }
    }
  }

  render() {
    return <Fragment>{this.props.children(this.state.player, this.state.highlights)}</Fragment>;
  }
}
