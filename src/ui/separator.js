// @flow

import React from "react";
import { css } from "glamor";
// helpers
import { BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, BOARD_PADDING } from "../styles";

/***********************************************************/

type Props = {
  type: "horizontal" | "vertical"
};

type State = {
  /* ... */
};

// /***********************************************************/

const $verticalStyle = css({
  width: BOARD_BORDER_WIDTH,
  height: "auto",
  margin: `0 ${BOARD_PADDING}em`,
  backgroundColor: BOARD_BORDER_COLOR
});

const $horizontalStyle = css({
  width: "auto",
  height: BOARD_BORDER_WIDTH,
  margin: `${BOARD_PADDING}em 0`,
  backgroundColor: BOARD_BORDER_COLOR
});

/***********************************************************/

export default class Separator extends React.Component<Props, State> {
  render() {
    return <div className={this.props.type == "vertical" ? $verticalStyle : $horizontalStyle} />;
  }
}
