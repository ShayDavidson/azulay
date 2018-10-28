// @flow

import React from "react";
import { css } from "glamor";
// types
import type { TilesColorCounter } from "../../models";
import { getTilesInColorCounter } from "../../models";
// helpers
import { GLOBAL_PADDING } from "../../styles";

/***********************************************************/

type Props = {
  bag: TilesColorCounter,
  box: TilesColorCounter
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  marginTop: GLOBAL_PADDING,
  marginBottom: GLOBAL_PADDING
});

const $firstStyle = css({
  marginBottom: GLOBAL_PADDING * 0.75
});

/***********************************************************/

export default class InfoZone extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        <div className={$firstStyle}>Tiles in bag: {getTilesInColorCounter(this.props.bag)}</div>
        <div>Discarded tiles: {getTilesInColorCounter(this.props.box)}</div>
      </div>
    );
  }
}
