// @flow

import React from "react";
import { css } from "glamor";
// helpers
import { BLACK_COLOR, WHITE_COLOR, floatAnimation } from "../styles";

/***********************************************************/

type Props = {
  value: string
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  fontSize: "0.5em",
  color: WHITE_COLOR,
  textShadow: `-1px -1px 0px ${BLACK_COLOR}, 0px -1px 0px ${BLACK_COLOR}, 1px -1px 0px ${BLACK_COLOR}, -1px 0px 0px ${BLACK_COLOR}, 1px 0px 0px ${BLACK_COLOR}, -1px 1px 0px ${BLACK_COLOR}, 0px 1px 0px ${BLACK_COLOR}, 1px  1px 0px ${BLACK_COLOR}, -2px -2px 0px ${BLACK_COLOR}, -1px -2px 0px ${BLACK_COLOR}, 0px -2px 0px ${BLACK_COLOR}, 1px -2px 0px ${BLACK_COLOR}, 2px -2px 0px ${BLACK_COLOR}, 2px -1px 0px ${BLACK_COLOR}, 2px 0px 0px ${BLACK_COLOR}, 2px 1px 0px ${BLACK_COLOR}, 2px 2px 0px ${BLACK_COLOR}, 1px 2px 0px ${BLACK_COLOR}, 0px  2px 0px ${BLACK_COLOR}, -1px 2px 0px ${BLACK_COLOR}, -2px 2px 0px ${BLACK_COLOR}, -2px 1px 0px ${BLACK_COLOR}, -2px 0px 0px ${BLACK_COLOR}, -2px -1px 0px ${BLACK_COLOR}`,
  position: "absolute",
  zIndex: 20000,
  height: "100%",
  width: "100%",
  textAlign: "center",
  animation: `${floatAnimation} 0.75s ease-out both`,
  willChange: "transform, opacity"
});

/***********************************************************/

export default class Floater extends React.Component<Props, State> {
  render() {
    return (
      <div key={Math.random()} className={$baseStyle}>
        {parseInt(this.props.value) > 0 ? `+${this.props.value}` : this.props.value}
      </div>
    );
  }
}
