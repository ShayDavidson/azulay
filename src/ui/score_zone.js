// @flow

import React from "react";
import { css } from "glamor";
// helpers
import { popAnimation } from "../styles";

/***********************************************************/

type Props = {
  label: string,
  score: number
};

type State = {
  /* ... */
};

/***********************************************************/

const $spanStyle = css({
  textAlign: "center",
  fontSize: "0.3em",
  color: "white"
});

const $boldStyle = css({
  fontWeight: "bold"
});

const $animatedStyle = css({
  animation: `${popAnimation} 0.4s ease-out both`
});

/***********************************************************/

export default class ScoreZone extends React.Component<Props, State> {
  render() {
    const $scoreStyle = this.props.score == 0 ? $boldStyle : css($boldStyle, $animatedStyle);

    return (
      <span className={$spanStyle}>
        {this.props.label}
        <br />
        <div key={this.props.score} className={$scoreStyle}>{`Score: ${this.props.score}`}</div>
      </span>
    );
  }
}
