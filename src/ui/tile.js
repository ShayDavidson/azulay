// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Tile as TileType } from "../models";
// helpers
import { TILE_COLORS, WHITE_COLOR, BLACK_COLOR, BLUE_COLOR, placeAnimation, ornaments } from "../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";
const SHADOW_DISTANCE = "0.04em";
const HIGHLIGHT_WIDTH = "0.05em";
const SHADOW_ALPHA = 0.7;
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.35;

/***********************************************************/

type Props = {
  tile: TileType,
  highlighted?: boolean,
  animated?: boolean,
  onClick?: TileType => void,
  surpressLabel?: boolean
};

type State = {
  /* ... */
};

/***********************************************************/

const $fillStyle = css({
  width: "100%",
  height: "100%",
  position: "relative"
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
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
});

const $labelStyle = css({
  fontSize: "0.5em",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateX(-50%) translateY(-50%)",
  color: BLUE_COLOR
});

const $animatedStyle = css({
  animation: `${placeAnimation} 0.25s ease-out both`
});

const $highlightedStyle = css({
  boxShadow: `0px 0px 0px 3px ${BLACK_COLOR}`
});

const $tileGradient =
  "radial-gradient(circle at top left, rgba(255, 255, 255, 0.45) 5%, rgba(255, 255, 255, 0.35) 20%, rgba(255, 255, 255, 0.0) 80%, rgba(255, 255, 255, 0.0) 100%)";

/***********************************************************/

export default class Tile extends React.PureComponent<Props, State> {
  render() {
    let { color, kind } = this.props.tile;
    let isColoredTile = kind == "colored";

    const $dynamicStyle = {
      backgroundColor: isColoredTile && color != undefined ? TILE_COLORS[color] : WHITE_COLOR,
      backgroundImage: ornaments[color] ? `${$tileGradient}, url(${ornaments[color]})` : $tileGradient,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      cursor: this.props.onClick != null ? "pointer" : "default"
    };

    let $staticStyle = $baseStyle;
    if (this.props.animated) $staticStyle = css($staticStyle, $animatedStyle);
    if (this.props.highlighted) $staticStyle = css($staticStyle, $highlightedStyle);

    return (
      <div className={$fillStyle}>
        <div
          className={$staticStyle}
          style={$dynamicStyle}
          onClick={() => this.props.onClick && this.props.onClick(this.props.tile)}
        >
          {isColoredTile || this.props.surpressLabel ? null : <div className={$labelStyle}>1</div>}
        </div>
      </div>
    );
  }
}
