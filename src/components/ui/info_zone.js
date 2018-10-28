// @flow

import React from "react";
import { css } from "glamor";
// types
import type { TilesColorCounter } from "../../models";
// helpers
import { GLOBAL_PADDING, TILE_COLORS } from "../../styles";

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

const $tdStyle = css({
  paddingLeft: "0.5em",
  textAlign: "right"
});

const $tileStyle = css({
  textShadow: "1px 1px black"
});

/***********************************************************/

export default class InfoZone extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        <table>
          <tr>
            <td>
              <strong>Tiles in the bag:</strong>
            </td>
            {this.props.bag.map((count, colorIndex) => {
              return (
                <td className={$tdStyle} key={colorIndex}>
                  {count}
                  <span className={$tileStyle} style={{ color: TILE_COLORS[colorIndex] }}>
                    ▩
                  </span>
                </td>
              );
            })}
          </tr>
          <tr>
            <td>
              <strong>Discarded tiles:</strong>
            </td>
            {this.props.box.map((count, colorIndex) => {
              return (
                <td className={$tdStyle} key={colorIndex}>
                  {count}
                  <span className={$tileStyle} style={{ color: TILE_COLORS[colorIndex] }}>
                    ▩
                  </span>
                </td>
              );
            })}
            <td />
          </tr>
        </table>
      </div>
    );
  }
}
