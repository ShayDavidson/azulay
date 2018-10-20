// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Factory as FactoryType } from "../../models";
// components
import Factory from "./factory";
// helpers
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

const $baseStyle = css({});

/***********************************************************/

export default class FactoryZone extends React.Component<Props, State> {
  render() {
    const factories = FACTORIES_BY_PLAYERS[this.props.players];
    return <div className={$baseStyle}>{[...new Array(factories)].map((_, index) => <Factory key={index} />)}</div>;
  }
}
