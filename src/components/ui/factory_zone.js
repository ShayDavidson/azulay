// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Factory as FactoryType } from "../../models";
// components
import Factory from "./factory";
// helpers
import { GLOBAL_PADDING } from "../../styles";

/***********************************************************/

type Props = {
  factories: Array<FactoryType>,
  players: number
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({
  display: "flex",
  flexDirection: "column"
});

const $factoriesStyle = css({
  position: "relative",
  display: "grid",
  gridTemplateColumns: `repeat(3, 104px)`,
  gridTemplateRows: `repeat(3, 104px)`,
  gridGap: GLOBAL_PADDING * 2,
  gridAutoFlow: "column"
});

const $leftoversStyle = css({
  marginTop: 2 * GLOBAL_PADDING,
  borderRadius: "50%",
  width: "100%",
  height: "100%",
  display: "grid"
  // gridTemplateColumns: `repeat(7, 1fr)`,
  // gridTemplateRows: `repeat(5, 1fr)`
});

/***********************************************************/

export default class FactoryZone extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        <div className={$factoriesStyle}>
          {this.props.factories.map((factoryTiles, index) => (
            <Factory key={index} tiles={factoryTiles} type="normal" />
          ))}
        </div>
        <div className={$leftoversStyle}>
          <Factory type="leftovers" />
        </div>
      </div>
    );
  }
}
