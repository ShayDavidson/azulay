// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Factory as FactoryType } from "../models";
// components
import Factory from "./factory";
// helpers
import { GLOBAL_PADDING } from "../styles";

/***********************************************************/

type Props = {
  factories: Array<FactoryType>,
  leftovers: FactoryType
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
  gridTemplateColumns: `repeat(3, 125px)`,
  gridTemplateRows: `repeat(3, 125px)`,
  gridGap: GLOBAL_PADDING,
  gridAutoFlow: "column"
});

const $leftoversStyle = css({
  marginTop: 2 * GLOBAL_PADDING,
  borderRadius: "50%",
  width: "100%",
  height: "100%"
});

/***********************************************************/

export default class FactoryZone extends React.PureComponent<Props, State> {
  render() {
    const selectionEnabled = true;
    return (
      <div className={$baseStyle}>
        <div className={$factoriesStyle}>
          {this.props.factories.map((factory, index) => (
            <Factory key={index} factory={factory} type="normal" selectionEnabled={selectionEnabled} />
          ))}
        </div>
        <div className={$leftoversStyle}>
          <Factory factory={this.props.leftovers} type="leftovers" selectionEnabled={selectionEnabled} />
        </div>
      </div>
    );
  }
}
