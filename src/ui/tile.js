// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Tile as TileType } from "../models";
// helpers
import { TILE_COLORS, WHITE_COLOR, BLACK_COLOR, placeAnimation, ornaments, firstOrnament } from "../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";
const SHADOW_DISTANCE = "0.04em";
const HIGHLIGHT_WIDTH = "0.09em";
const SHADOW_ALPHA = 0.7;
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.35;

/***********************************************************/

type Props = {
  tile: TileType,
  highlighted?: boolean,
  animated?: boolean,
  onClick?: TileType => any,
  surpressLabel?: boolean
};

type State = {
  /* ... */
};

/***********************************************************/

const $fillStyle = css({
  width: "100%",
  height: "100%",
  position: "relative",
  transition: "box-shadow 0.3s ease-in-out",
  willChange: "box-shadow",
  borderRadius: BORDER_RADIUS
});

const $baseStyle = css({
  width: "100%",
  height: "100%",
  boxShadow: `${SHADOW_DISTANCE} ${SHADOW_DISTANCE} rgba(0, 0, 0, ${SHADOW_ALPHA})`,
  borderRadius: BORDER_RADIUS,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute",
  zIndex: 10000,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA + 0.1})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(80, 80, 80, ${DARK_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
});

const $animatedStyle = css({
  animation: `${placeAnimation} 0.4s ease-out both`
});

const $highlightedStyle = css({
  boxShadow: `0px 0px 0px 3px ${BLACK_COLOR}`
});

const $tileGradient =
  "radial-gradient(circle at top left, rgba(255, 255, 255, 0.40) 5%, rgba(255, 255, 255, 0.25) 20%, rgba(255, 255, 255, 0.0) 80%, rgba(255, 255, 255, 0.0) 100%)";

/***********************************************************/

export default class Tile extends React.PureComponent<Props, State> {
  render() {
    let { color, kind } = this.props.tile;
    let isColoredTile = kind == "colored";

    let backgroundImage;
    if (color != null && ornaments[color]) {
      backgroundImage = `${$tileGradient}, url(${ornaments[color]})`;
    }
    if (kind == "first") {
      backgroundImage = `${$tileGradient}, url(${firstOrnament})`;
    } else {
      backgroundImage = $tileGradient;
    }

    const $dynamicStyle = {
      backgroundColor: isColoredTile && color != undefined ? TILE_COLORS[color] : WHITE_COLOR,
      backgroundImage,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      cursor: this.props.onClick != null ? "pointer" : "default"
    };

    return (
      <div className={this.props.highlighted ? css($fillStyle, $highlightedStyle) : $fillStyle}>
        <div
          className={this.props.animated ? css($baseStyle, $animatedStyle) : $baseStyle}
          style={$dynamicStyle}
          onClick={() => this.props.onClick && this.props.onClick(this.props.tile)}
        />
      </div>
    );
  }
}
