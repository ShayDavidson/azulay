// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../models";
// components
import Wall from "./wall";
import Staging from "./staging";
import Floor from "./floor";
import Separator from "./separator";
// helpers
import {
  BOARD_BORDER_WIDTH,
  BOARD_BORDER_COLOR,
  BOARD_PADDING,
  BOARD_COLOR,
  WHITE_COLOR,
  $bevelStyle
} from "../styles";
import { PLAYER_TYPE } from "../models";

/***********************************************************/

type Props = {
  player: Player,
  current: boolean
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

const $spanStyle = css({
  textAlign: "center",
  fontSize: "0.3em",
  color: "white"
});

/***********************************************************/

export default class PlayerBoard extends React.Component<Props, State> {
  render() {
    const { board: { wall, staging, floor }, score, name, type } = this.props.player;
    return (
      <div
        className={$baseStyle}
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
          <Staging selectionEnabled={this.props.current} staging={staging} />
          <Separator type="vertical" />
          <Wall wall={wall} />
        </div>
        <Separator type="horizontal" />
        <div className={$rowContainerStyle} style={{ width: "100%" }}>
          <Floor selectionEnabled={this.props.current} floor={floor} />
          <div className={$scoreZoneStyle}>
            <span className={$spanStyle}>
              {`${name} - ${type == PLAYER_TYPE.human ? "Human" : "AI"}`}
              <br />
              <strong>{`Score: ${score}`}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
