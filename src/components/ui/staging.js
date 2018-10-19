// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Staging as StagingType } from "../../models";
// components
import Placement from "./placement";
// helpers
import { placementsForStagingRow, COLORS } from "../../models";
import { PLACEMENT_GAP } from "../../styles";

/***********************************************************/

type Props = {
  staging: StagingType
};

type State = {
  /* ... */
};

// /***********************************************************/

const $containerStyle = css({
  width: "max-content"
});

const $stagingRowStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${COLORS}, 1em)`,
  gridTemplateRows: `repeat(1, 1em)`,
  gridRowGap: `${PLACEMENT_GAP}em`,
  gridColumnGap: `${PLACEMENT_GAP}em`,
  justifyContent: "end"
});

/***********************************************************/

export default class Staging extends React.Component<Props, State> {
  render() {
    return (
      <div className={$containerStyle}>
        {this.props.staging.map((stagingRow, index) => {
          return (
            <div className={$stagingRowStyle} key={index}>
              {[...Array(placementsForStagingRow(index))].map((_, col) => <Placement key={col} />)}
            </div>
          );
        })}
      </div>
    );
  }
}
