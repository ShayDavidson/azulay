// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../../models";
// components
import Wall from "./wall";
import Staging from "./staging";
import Floor from "./floor";
import Separator from "./separator";
// helpers
import { BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, BOARD_PADDING, $bevelStyle } from "../../styles";
import { PLAYER_TYPE } from "../../models";

/***********************************************************/

type Props = {
  player: Player,
  current: boolean
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`,
  padding: "0.15em",
  borderRadius: "0.1em",
  backgroundColor: "rgb(211, 182, 152)",
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
        style={this.props.current ? { border: `calc(${BOARD_BORDER_WIDTH} * 2) solid white` } : {}}
      >
        <div className={$rowContainerStyle} style={{ width: "max-content" }}>
          <Staging staging={staging} />
          <Separator type="vertical" />
          <Wall wall={wall} />
        </div>
        <Separator type="horizontal" />
        <div className={$rowContainerStyle} style={{ width: "100%" }}>
          <Floor floor={floor} />
          <div className={$scoreZoneStyle}>
            <span className={$spanStyle}>
              {`${name} - ${type == PLAYER_TYPE.human ? "Human" : "CPU"}`}
              <br />
              <strong>{`Score: ${score}`}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
