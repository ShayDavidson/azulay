// @flow

import React from "react";
import { css } from "glamor";
// types
import type { Player } from "../models";
import type { Highlights } from "../ui_models";
// components
import Wall from "./wall";
import Staging from "./staging";
import Floor from "./floor";
import Separator from "./separator";
import ScoreZone from "./score_zone";
// helpers
import {
  BOARD_BORDER_WIDTH,
  BOARD_BORDER_COLOR,
  BOARD_PADDING,
  BOARD_COLOR,
  WHITE_COLOR,
  $bevelStyle,
  subtlePopAnimation,
  fadeInAnimation
} from "../styles";
import { PLAYER_TYPE } from "../models";

/***********************************************************/

type Props = {
  player: Player,
  current: boolean,
  highlights?: ?Highlights,
  label?: string
};

type State = {
  player: Player
};

// /***********************************************************/

const $baseStyle = css({
  border: `${BOARD_BORDER_WIDTH} solid ${BOARD_BORDER_COLOR}`,
  padding: "0.15em",
  borderRadius: "0.1em",
  backgroundColor: BOARD_COLOR,
  boxShadow: "2px 2px 0 0 rgba(0, 0, 0, 0.1)",
  width: "max-content",
  willChange: "transform",
  position: "relative"
});

const $withLabelStyle = css({
  "::before": {
    content: " ",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    animation: `${fadeInAnimation} 1s ease-out`,
    willChange: "opacity"
  },
  "::after": {
    fontSize: "1em",
    content: "attr(data-label)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: "0 0.15em",
    animation: `${fadeInAnimation} 1s ease-out`,
    willChange: "opacity",
    color: WHITE_COLOR,
    textShadow: "1px 1px black"
  }
});

const $rowContainerStyle = css({
  display: "flex"
});

const $scoreZoneStyle = css($bevelStyle, {
  backgroundColor: BOARD_BORDER_COLOR,
  borderRadius: "0.1em",
  width: "inherit",
  marginLeft: `${BOARD_PADDING}em`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const $animatedStyle = css({
  animation: `${subtlePopAnimation} 0.4s ease-out both`
});

/***********************************************************/

export default class PlayerBoard extends React.PureComponent<Props, State> {
  render() {
    const {
      board: { wall, staging, floor },
      score,
      name,
      type
    } = this.props.player;
    let $boardStyle = this.props.current ? css($animatedStyle, $baseStyle) : $baseStyle;
    if (this.props.label != null) {
      $boardStyle = css($boardStyle, $withLabelStyle);
    }
    return (
      <div
        data-label={this.props.label}
        className={$boardStyle}
        style={
          this.props.current
            ? {
                border: `${BOARD_BORDER_WIDTH} solid ${WHITE_COLOR}`,
                boxShadow: `inset 0 0 0 ${BOARD_BORDER_WIDTH} ${WHITE_COLOR}`
              }
            : {}
        }
      >
        <div className={$rowContainerStyle} style={{ width: "max-content" }}>
          <Staging selectionEnabled={this.props.current} staging={staging} highlights={this.props.highlights} />
          <Separator type="vertical" />
          <Wall wall={wall} highlights={this.props.highlights} />
        </div>
        <Separator type="horizontal" />
        <div className={$rowContainerStyle} style={{ width: "100%" }}>
          <Floor
            selectionEnabled={this.props.current}
            floor={floor}
            highlights={
              this.props.highlights && this.props.highlights.type == "floor" ? this.props.highlights : undefined
            }
          />
          <div className={$scoreZoneStyle}>
            <ScoreZone score={score} label={`${name} - ${type == PLAYER_TYPE.human ? "Human" : "AI"}`} />
          </div>
        </div>
      </div>
    );
  }
}
