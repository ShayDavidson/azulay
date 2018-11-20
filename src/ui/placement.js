// @flow

import React from "react";
import { css } from "glamor";
import Color from "color";
// types
import type { ColorType, Tile as TileType } from "../models";
// components
import Tile from "./tile";
// helpers
import { TILE_COLORS, LABEL_COLORS, BLACK_COLOR, HIGHLIGHT_WIDTH, $bevelStyle } from "../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";

/***********************************************************/

type Props = {
  color?: ColorType,
  tile?: ?TileType,
  label?: string,
  highlighted?: boolean
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

const $highlightedStyle = css({
  border: `calc(2 * ${HIGHLIGHT_WIDTH}) solid ${BLACK_COLOR}`
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

    let $dynamicBaseStyle = $baseStyle;

    if (this.props.highlighted) {
      $dynamicBaseStyle = css($dynamicBaseStyle, $highlightedStyle);
    }

    const $dynamicLabelStyle =
      this.props.tile && this.props.tile.color != undefined
        ? {
            color: LABEL_COLORS[this.props.tile.color]
          }
        : { color: LABEL_COLORS[0] };

    return (
      <div className={$dynamicBaseStyle} style={$dynamicStyle}>
        {this.props.tile != null ? <Tile animated={true} surpressLabel={true} tile={this.props.tile} /> : null}
        {this.props.label != null ? (
          <div className={$labelStyle} style={$dynamicLabelStyle}>
            {this.props.label}
          </div>
        ) : null}
      </div>
    );
  }
}
