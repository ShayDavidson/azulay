// @flow

import React, { Component } from "react";
import { css } from "glamor";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  backgroundColor: "#fff5fe",
  borderTop: `5px solid #d66313`,
  borderLeft: `5px solid #d66313`,
  borderRight: `5px solid #a04b10`,
  borderBottom: `5px solid #a04b10`,
  width: "100px",
  height: "100px",
  boxShadow: `1px 1px rgba(0, 0, 0, 0.5)`,
  borderRadius: "50%"
});

/***********************************************************/

export default class Factory extends Component<Props, State> {
  render() {
    return <div className={$baseStyle} />;
  }
}
