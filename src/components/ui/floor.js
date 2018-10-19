// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Floor as FloorType } from "../../models";
// components
import Placement from "./placement";
// helpers
import { FLOOR_SLOTS } from "../../models";
import { PLACEMENT_GAP } from "../../styles";

/***********************************************************/

type Props = {
  floor: FloorType
};

type State = {
  /* ... */
};

// /***********************************************************/

const $baseStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${FLOOR_SLOTS.length}, 1em)`,
  gridTemplateRows: `repeat(1, 1em)`,
  gridGap: `${PLACEMENT_GAP}em`
});

/***********************************************************/

export default class Floor extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        {FLOOR_SLOTS.map((score, index) => <Placement label={score.toString()} key={index} />)}
      </div>
    );
  }
}
