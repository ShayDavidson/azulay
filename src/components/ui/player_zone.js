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
import { BOARD_TILE_SIZE, BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, BOARD_PADDING } from "../../styles";

/***********************************************************/

type Props = {
  player: Player
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({
  fontSize: BOARD_TILE_SIZE,
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

const $scoreZoneStyle = css({
  backgroundColor: BOARD_BORDER_COLOR,
  borderRadius: "0.1em",
  width: "inherit",
  marginLeft: `${BOARD_PADDING}em`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const $spanStyle = css({
  fontSize: "0.3em"
});

/***********************************************************/

export default class PlayerZone extends React.Component<Props, State> {
  render() {
    const { board: { wall, staging, floor }, score } = this.props.player;
    return (
      <div className={$baseStyle}>
        <div className={$rowContainerStyle} style={{ width: "max-content" }}>
          <Staging staging={staging} />
          <Separator type="vertical" />
          <Wall wall={wall} />
        </div>
        <Separator type="horizontal" />
        <div className={$rowContainerStyle} style={{ width: "100%" }}>
          <Floor floor={floor} />
          <div className={$scoreZoneStyle}>
            <span className={$spanStyle}>{`Score: ${score}`}</span>
          </div>
        </div>
      </div>
    );
  }
}
