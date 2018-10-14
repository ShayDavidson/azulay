// @flow

import React, { Component } from "react";
import { TILE_COLORS, BOARD_TILE_SIZE } from "../styles";

/***********************************************************/

const BASE_SIZE = BOARD_TILE_SIZE;
const BORDER_RADIUS = "0.12em";
const SHADOW_DISTANCE = "0.04em";
const HIGHLIGHT_WIDTH = "0.06em";
const SHADOW_ALPHA = 0.7;
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.15;

type Props = {
  color: number
};

type State = {
  /* ... */
};

export default class Tile extends Component<Props, State> {
  render() {
    const externalStyle = {
      width: BASE_SIZE,
      height: BASE_SIZE,
      fontSize: BASE_SIZE,
      backgroundColor: TILE_COLORS[this.props.color],
      boxShadow: `${SHADOW_DISTANCE} ${SHADOW_DISTANCE} rgba(0, 0, 0, ${SHADOW_ALPHA})`,
      borderRadius: BORDER_RADIUS,
      position: "relative"
    };

    const internalStyle = {
      width: "100%",
      height: "100%",
      borderRadius: BORDER_RADIUS,
      borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
      borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
      borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
      borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
      position: "absolute"
    };

    return (
      <div style={externalStyle}>
        <div style={internalStyle} />
      </div>
    );
  }
}
