// @flow

import React from "react";
import { css } from "glamor";
import Color from "color";
// types
import type { ColorType } from "../../models";
// components
import Tile from "./tile";
// helpers
import { TILE_COLORS, LABEL_COLORS } from "../../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.15;
const HIGHLIGHT_WIDTH = "0.03em";

/***********************************************************/

type Props = {
  color?: ColorType,
  hasTileOfColor?: ColorType,
  label?: string
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  borderRadius: BORDER_RADIUS,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  position: "relative"
});

const $labelStyle = css({
  fontSize: "0.3em",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateX(-50%) translateY(-50%)"
});

/***********************************************************/

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

    const $dynamicLabelStyle = this.props.hasTileOfColor
      ? {
          color: LABEL_COLORS[this.props.hasTileOfColor]
        }
      : {};

    return (
      <div className={$baseStyle} style={$dynamicStyle}>
        {this.props.hasTileOfColor != undefined ? <Tile color={this.props.hasTileOfColor} /> : null}
        {this.props.label != undefined ? (
          <div className={$labelStyle} style={$dynamicLabelStyle}>
            {this.props.label}
          </div>
        ) : null}
      </div>
    );
  }
}
