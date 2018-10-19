// @flow

import React from "react";
import { css } from "glamor";

/***********************************************************/

import type { Player } from "../../models";
import Wall from "./wall";

/***********************************************************/

type Props = {
  player: Player
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({});

/***********************************************************/

export default class PlayerZone extends React.Component<Props, State> {
  render() {
    const { board: { wall } } = this.props.player;
    return <Wall wall={wall} />;
  }
}
