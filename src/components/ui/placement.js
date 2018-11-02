// @flow

import React from "react";
import { css } from "glamor";
import Color from "color";
// types
import type { ColorType, Tile as TileType } from "../../models";
// components
import Tile from "./tile";
// helpers
import { TILE_COLORS, LABEL_COLORS, $bevelStyle } from "../../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";

/***********************************************************/

type Props = {
  color?: ColorType,
  tile?: TileType,
  label?: string
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css($bevelStyle, {
  borderRadius: BORDER_RADIUS,
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

    const $dynamicLabelStyle =
      this.props.tile && this.props.tile.color != undefined
        ? {
            color: LABEL_COLORS[this.props.tile.color]
          }
        : { color: LABEL_COLORS[0] };

    return (
      <div className={$baseStyle} style={$dynamicStyle}>
        {this.props.tile != undefined ? <Tile tile={this.props.tile} /> : null}
        {this.props.label != undefined ? (
          <div className={$labelStyle} style={$dynamicLabelStyle}>
            {this.props.label}
          </div>
        ) : null}
      </div>
    );
  }
}
