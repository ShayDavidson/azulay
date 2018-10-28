// @flow

import React from "react";
import { css } from "glamor";
// helpers
import { BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, WHITE_COLOR } from "../../styles";

/***********************************************************/

type Props = {
  type: "normal" | "leftovers"
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  boxShadow: "2px 2px 0 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  display: "grid"
});

const $standardStyle = css($baseStyle, {
  background: `linear-gradient(135deg, ${WHITE_COLOR} 0%, ${WHITE_COLOR} 50%, hsl(10, 10%, 88%) 50%, hsl(10, 10%, 88%) 100%)`,
  borderTop: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderLeft: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderRight: `${BOARD_BORDER_WIDTH} solid #a04b10`,
  borderBottom: `${BOARD_BORDER_WIDTH} solid #a04b10`,
  gridTemplateColumns: `repeat(2, 1fr)`,
  gridTemplateRows: `repeat(2, 1fr)`
});

const $leftoversStyle = css($baseStyle, {
  background: "hsl(10, 10%, 88%)",
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`,
  gridTemplateColumns: `repeat(7, 1fr)`,
  gridTemplateRows: `repeat(7, 1fr)`
});

/***********************************************************/

export default class Factory extends React.Component<Props, State> {
  render() {
    return <div className={this.props.type == "normal" ? $standardStyle : $leftoversStyle} />;
  }
}
