// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Factory as FactoryType } from "../../models";
// components
import Factory from "./factory";
// helpers
import { GLOBAL_PADDING } from "../../styles";
import { FACTORIES_BY_PLAYERS } from "../../models";

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
  gridTemplateColumns: `repeat(3, 100px)`,
  gridTemplateRows: `repeat(3, 100px)`,
  gridGap: GLOBAL_PADDING,
  gridAutoFlow: "column"
});

const $leftoversStyle = css({
  marginTop: GLOBAL_PADDING,
  marginBottom: GLOBAL_PADDING,
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
    const factories = FACTORIES_BY_PLAYERS[this.props.players];
    return (
      <div className={$baseStyle}>
        <div className={$factoriesStyle}>
          {[...new Array(factories)].map((_, index) => <Factory key={index} type="normal" />)}
        </div>
        <div className={$leftoversStyle}>
          <Factory type="leftovers" />
        </div>
      </div>
    );
  }
}
