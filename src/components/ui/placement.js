// @flow

import React from "react";
import { css } from "glamor";
import Color from "color";
// types
import type { ColorType } from "../../models";
// components
import Tile from "./tile";
// helpers
import { TILE_COLORS } from "../../styles";

/***********************************************************/

const BORDER_RADIUS = "0.12em";
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.15;
const HIGHLIGHT_WIDTH = "0.06em";

type Props = {
  color?: ColorType,
  hasTileOfColor?: ColorType
};

type State = {
  /* ... */
};

const $baseStyle = css({
  borderRadius: BORDER_RADIUS,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative"
});

const $internalStyle = css({
  width: "100%",
  height: "100%",
  borderRadius: BORDER_RADIUS,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  position: "absolute"
});

export default class Placement extends React.Component<Props, State> {
  render() {
    const $dynamicStyle =
      this.props.color != undefined
        ? {
            backgroundColor: Color(TILE_COLORS[this.props.color])
              .desaturate(0.5)
              .toString()
          }
        : {
            backgroundColor: "rgba(0, 0, 0, 0.25)"
          };

    return (
      <div className={$baseStyle} style={$dynamicStyle}>
        <div className={$internalStyle} />
        {this.props.hasTileOfColor != undefined ? <Tile color={this.props.hasTileOfColor} /> : null}
      </div>
    );
  }
}
