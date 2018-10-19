// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../../models";
// components
import Wall from "./wall";
import Staging from "./staging";
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
  width: "max-content"
});

/***********************************************************/

export default class PlayerZone extends React.Component<Props, State> {
  render() {
    const { board: { wall, staging } } = this.props.player;
    return (
      <div className={$baseStyle}>
        <Staging staging={staging} />
        <Wall wall={wall} />
      </div>
    );
  }
}
