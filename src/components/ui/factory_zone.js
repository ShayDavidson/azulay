// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Factory as FactoryType, Leftovers } from "../../models";
// components
import Factory from "./factory";
// helpers
import { GLOBAL_PADDING } from "../../styles";

/***********************************************************/

type Props = {
  factories: Array<FactoryType>,
  leftovers: Leftovers
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
          <Factory
            tiles={this.props.leftovers.tiles}
            hasFirstTile={this.props.leftovers.hasFirstTile}
            type="leftovers"
          />
        </div>
      </div>
    );
  }
}
