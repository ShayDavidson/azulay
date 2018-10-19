// @flow

import React from "react";
import { css } from "glamor";

/***********************************************************/

import { TILE_COLORS } from "../../styles";

/***********************************************************/

const BORDER_RADIUS = "0.12em";
const SHADOW_DISTANCE = "0.04em";
const HIGHLIGHT_WIDTH = "0.06em";
const SHADOW_ALPHA = 0.7;
const LIGHT_BORDER_ALPHA = 0.55;
const DARK_BORDER_ALPHA = 0.15;

/***********************************************************/

type Props = {
  color: number
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
  position: "relative"
});

const $internalStyle = css({
  width: "100%",
  height: "100%",
  borderRadius: BORDER_RADIUS,
  borderTop: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderLeft: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${LIGHT_BORDER_ALPHA})`,
  borderBottom: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  borderRight: `${HIGHLIGHT_WIDTH} solid rgba(255, 255, 255, ${DARK_BORDER_ALPHA})`,
  position: "absolute"
});

/***********************************************************/

export default class Tile extends React.Component<Props, State> {
  render() {
    const $dynamicStyle = { backgroundColor: TILE_COLORS[this.props.color] };

    return (
      <div className={$baseStyle} style={$dynamicStyle}>
        <div className={$internalStyle} />
      </div>
    );
  }
}
