// @flow

import React from "react";
import { css } from "glamor";
// helpers
import { BOARD_BORDER_WIDTH } from "../../styles";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  background:
    "linear-gradient(135deg, hsl(30, 20%, 90%) 0%, hsl(30, 20%, 90%) 50%, hsl(10, 10%, 88%) 50%, hsl(10, 10%, 88%) 100%)",
  borderTop: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderLeft: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderRight: `${BOARD_BORDER_WIDTH} solid #a04b10`,
  borderBottom: `${BOARD_BORDER_WIDTH} solid #a04b10`,
  width: "100px",
  height: "100px",
  boxShadow: "2px 2px 0 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  display: "inline-block"
});

/***********************************************************/

export default class Factory extends React.Component<Props, State> {
  render() {
    return <div className={$baseStyle} />;
  }
}
