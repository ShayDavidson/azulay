// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../../models";
// components
import Wall from "./wall";
import Staging from "./staging";
import Floor from "./floor";
// helpers
import { BOARD_TILE_SIZE } from "../../styles";

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
  width: "max-content",
  display: "grid",
  gridTemplateColumns: `repeat(2, 2fr)`,
  gridTemplateRows: `repeat(1, 1fr)`,
  gridGap: "0.1em"
});

/***********************************************************/

export default class PlayerZone extends React.Component<Props, State> {
  render() {
    const { board: { wall, staging, floor } } = this.props.player;
    return (
      <div className={$baseStyle}>
        <Staging staging={staging} />
        <Wall wall={wall} />
        <Floor floor={floor} />
      </div>
    );
  }
}
