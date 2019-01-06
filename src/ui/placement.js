// @flow

import React from "react";
import { css } from "glamor";

// types
import type { ColorType, Tile as TileType } from "../models";
// components
import Tile from "./tile";
// helpers
import { PLACEMENT_COLORS, LABEL_COLORS, BLACK_COLOR, HIGHLIGHT_WIDTH, $bevelStyle } from "../styles";

/***********************************************************/

const BORDER_RADIUS = "0.1em";

/***********************************************************/

type Props = {
  color?: ColorType,
  tile?: ?TileType,
  label?: string,
  highlighted?: boolean,
  highlightType?: "selection" | "scoring" | "bonus" | "minus"
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css($bevelStyle, {
  borderRadius: BORDER_RADIUS,
  position: "relative",
  transition: "filter 0.25s ease-out"
});

const $labelStyle = css({
  fontSize: "0.3em",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateX(-50%) translateY(-50%)"
});

const $highlightedStyle = css({
  cursor: "pointer",
  border: `calc(2 * ${HIGHLIGHT_WIDTH}) solid ${BLACK_COLOR}`
});

const $highlightedTypes = {
  selection: css({}),
  scoring: css({ border: "none", filter: "saturate(2)" }),
  bonus: css({ border: "none", filter: "saturate(4)" }),
  minus: css({ border: "none", filter: "saturate(0.25)" })
};

/***********************************************************/

export default class Placement extends React.PureComponent<Props, State> {
  render() {
    const $dynamicStyle =
      this.props.color != undefined
        ? {
            backgroundColor: PLACEMENT_COLORS[this.props.color]
          }
        : {
            backgroundColor: "rgba(0, 0, 0, 0.25)"
          };

    let $dynamicBaseStyle = $baseStyle;

    if (this.props.highlighted) {
      $dynamicBaseStyle = css(
        $dynamicBaseStyle,
        $highlightedStyle,
        this.props.highlightType ? $highlightedTypes[this.props.highlightType] : $highlightedTypes.selection
      );
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
