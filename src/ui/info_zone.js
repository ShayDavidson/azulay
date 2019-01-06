// @flow

import React from "react";
import { css } from "glamor";
// types
import type { TilesArray } from "../models";
// helpers
import { getTilesColorCounter } from "../models";
import { GLOBAL_PADDING, TILE_COLORS, popAnimation } from "../styles";

/***********************************************************/

type Props = {
  bag: TilesArray,
  box: TilesArray,
  turn: number
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  marginTop: GLOBAL_PADDING,
  marginBottom: GLOBAL_PADDING,
  fontSize: "0.35em"
});

const $tdStyle = css({
  paddingLeft: "0.5em",
  textAlign: "right"
});

const $tileStyle = css({
  textShadow: "1px 1px black"
});

const $animatedStyle = css({
  animation: `${popAnimation} 0.4s ease-out both`,
  transformOrigin: "0% 50%",
  fontWeight: "bold"
});

/***********************************************************/

export default class InfoZone extends React.Component<Props, State> {
  render() {
    let bag = getTilesColorCounter(this.props.bag);
    let box = getTilesColorCounter(this.props.box);
    return (
      <div className={$baseStyle}>
        <table>
          <tbody>
            <tr>
              <td>
                <div key={this.props.turn} className={$animatedStyle}>
                  Turn {this.props.turn + 1}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Tiles in the bag:</strong>
              </td>
              {bag.map((count, colorIndex) => {
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
              {box.map((count, colorIndex) => {
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
          </tbody>
        </table>
      </div>
    );
  }
}
