// @flow

import React from "react";
import { css } from "glamor";
// types
import type { TilesColorCounter } from "../../models";
// components
import Tile from "./tile";
// helpers
import { BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, WHITE_COLOR } from "../../styles";
import { reduceColorCounterToArray } from "../../models";

/***********************************************************/

type Props = {
  type: "normal" | "leftovers",
  tiles: TilesColorCounter
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  boxShadow: "2px 2px 0 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const $containerStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(2, 1em)`,
  gridTemplateRows: `repeat(2, 1em)`,
  gridGap: "0.25em"
});

const $standardStyle = css($baseStyle, {
  background: `linear-gradient(135deg, ${WHITE_COLOR} 0%, ${WHITE_COLOR} 50%, hsl(10, 10%, 88%) 50%, hsl(10, 10%, 88%) 100%)`,
  borderTop: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderLeft: `${BOARD_BORDER_WIDTH} solid #d66313`,
  borderRight: `${BOARD_BORDER_WIDTH} solid #a04b10`,
  borderBottom: `${BOARD_BORDER_WIDTH} solid #a04b10`
});

const $leftoversStyle = css($baseStyle, {
  background: "hsl(10, 10%, 88%)",
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`
});

/***********************************************************/

export default class Factory extends React.Component<Props, State> {
  render() {
    let tilesArray = reduceColorCounterToArray(this.props.tiles);
    return (
      <div className={this.props.type == "normal" ? $standardStyle : $leftoversStyle}>
        <div className={$containerStyle}>
          {tilesArray.map((tileColor, index) => (
            <div key={index}>
              <Tile color={tileColor} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
