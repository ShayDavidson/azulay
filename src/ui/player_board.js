// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../models";
import type { Highlights } from "../ui_models";
// components
import Wall from "./wall";
import Staging from "./staging";
import Floor from "./floor";
import Separator from "./separator";
import ScoreZone from "./score_zone";
// helpers
import {
  BOARD_BORDER_WIDTH,
  BOARD_BORDER_COLOR,
  BOARD_PADDING,
  BOARD_COLOR,
  WHITE_COLOR,
  $bevelStyle,
  subtlePopAnimation
} from "../styles";
import { PLAYER_TYPE } from "../models";

/***********************************************************/

type Props = {
  player: Player,
  current: boolean,
  highlights?: ?Highlights
};

type State = {
  player: Player
};

// /***********************************************************/

const $baseStyle = css({
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`,
  padding: "0.15em",
  borderRadius: "0.1em",
  backgroundColor: BOARD_COLOR,
  boxShadow: "2px 2px 0 0 rgba(0, 0, 0, 0.1)",
  width: "max-content"
});

const $rowContainerStyle = css({
  display: "flex"
});

const $scoreZoneStyle = css($bevelStyle, {
  backgroundColor: BOARD_BORDER_COLOR,
  borderRadius: "0.1em",
  width: "inherit",
  marginLeft: `${BOARD_PADDING}em`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const $animatedStyle = css({
  animation: `${subtlePopAnimation} 0.4s ease-out both`
});

/***********************************************************/

export default class PlayerBoard extends React.Component<Props, State> {
  render() {
    const { board: { wall, staging, floor }, score, name, type } = this.props.player;
    return (
      <div
        className={this.props.current ? css($animatedStyle, $baseStyle) : $baseStyle}
        style={
          this.props.current
            ? {
                border: `${BOARD_BORDER_WIDTH} solid ${WHITE_COLOR}`,
                boxShadow: `inset 0 0 0 ${BOARD_BORDER_WIDTH} ${WHITE_COLOR}`
              }
            : {}
        }
      >
        <div className={$rowContainerStyle} style={{ width: "max-content" }}>
          <Staging selectionEnabled={this.props.current} staging={staging} highlights={this.props.highlights} />
          <Separator type="vertical" />
          <Wall wall={wall} highlights={this.props.highlights} />
        </div>
        <Separator type="horizontal" />
        <div className={$rowContainerStyle} style={{ width: "100%" }}>
          <Floor
            selectionEnabled={this.props.current}
            floor={floor}
            highlights={
              this.props.highlights && this.props.highlights.type == "floor" ? this.props.highlights : undefined
            }
          />
          <div className={$scoreZoneStyle}>
            <ScoreZone score={score} label={`${name} - ${type == PLAYER_TYPE.human ? "Human" : "AI"}`} />
          </div>
        </div>
      </div>
    );
  }
}
