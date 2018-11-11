// @flow

import React from "react";
import { css } from "glamor";
// types
import type { TilesArray } from "../../models";
// components
import Tile from "./tile";
// helpers
import { BOARD_BORDER_WIDTH, BOARD_BORDER_COLOR, WHITE_COLOR, BOARD_COLOR } from "../../styles";

/***********************************************************/

type Props = {
  type: "normal" | "leftovers",
  tiles: TilesArray,
  hasFirstTile?: boolean,
  selectionEnabled?: boolean
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

const $leftoversContainerStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(7, 1em)`,
  gridTemplateRows: `repeat(4, 1em)`,
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
  background: BOARD_COLOR,
  borderRadius: "1em",
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`
});

/***********************************************************/

export default class Factory extends React.Component<Props, State> {
  render() {
    return (
      <div className={this.props.type == "normal" ? $standardStyle : $leftoversStyle}>
        <div className={this.props.type == "normal" ? $containerStyle : $leftoversContainerStyle}>
          {this.props.tiles.map((tile, index) => (
            <div key={index}>
              <Tile tile={tile} animated={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
