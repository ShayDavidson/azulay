// @flow

import React from "react";
import { css } from "glamor";
// types
import type { ColorType } from "../../models";
// helpers
import { TILE_COLORS } from "../../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";
const SHADOW_DISTANCE = "0.04em";
const HIGHLIGHT_WIDTH = "0.05em";
const SHADOW_ALPHA = 0.7;
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.35;

/***********************************************************/

type Props = {
  color: ColorType,
  firstPlayer?: boolean
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  width: "100%",
  height: "100%",
  boxShadow: `${SHADOW_DISTANCE} ${SHADOW_DISTANCE} rgba(0, 0, 0, ${SHADOW_ALPHA})`,
  borderRadius: BORDER_RADIUS,
  position: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(127, 127, 127, ${DARK_BORDER_ALPHA})`
});

/***********************************************************/

export default class Tile extends React.Component<Props, State> {
  render() {
    const $dynamicStyle = {
      backgroundColor: this.props.firstPlayer ? "hsl(160, 50%, 40%)" : TILE_COLORS[this.props.color]
    };

    return <div className={$baseStyle} style={$dynamicStyle} />;
  }
}
